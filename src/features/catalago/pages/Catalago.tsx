import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/app/stores/authStore';
import { useNavigate } from 'react-router-dom';

interface LivroCatalogo {
  id: number;
  livroId: number;
  usuarioId: number;
  disponivel: boolean;
  titulo?: string;
}

export const Catalogo: React.FC = () => {
  const { token, usuarioId, tipoUsuario } = useAuthStore();
  const navigate = useNavigate();
  const [livros, setLivros] = useState<LivroCatalogo[]>([]); // Tipar o estado
  const [filtroTitulo, setFiltroTitulo] = useState('');
  const [filtroDisponivel, setFiltroDisponivel] = useState<boolean | null>(null);
  const [novoLivroId, setNovoLivroId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLivros = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filtroTitulo) params.append('titulo', filtroTitulo);
        if (filtroDisponivel !== null) params.append('disponivel', filtroDisponivel.toString());
        const response = await axios.get(`http://localhost:8080/api/catalogo?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLivros(response.data); // O backend deve retornar LivroCatalogo[]
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar catálogo');
      }
      setLoading(false);
    };
    if (token) fetchLivros();
    else navigate('/login');
  }, [token, filtroTitulo, filtroDisponivel, navigate]);

  const handleAddLivro = async () => {
    if (tipoUsuario !== 'sebo') return;
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:8080/api/catalogo',
        {
          livroId: parseInt(novoLivroId),
          usuarioId,
          disponivel: true,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNovoLivroId('');
      const response = await axios.get('http://localhost:8080/api/catalogo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLivros(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao adicionar livro');
    }
    setLoading(false);
  };

  const handleToggleDisponibilidade = async (id: number, disponivel: boolean) => {
    if (tipoUsuario !== 'sebo') return;
    setLoading(true);
    try {
      await axios.patch(
        `http://localhost:8080/api/catalogo/${id}/disponibilidade?disponivel=${!disponivel}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLivros(
        livros.map((livro) =>
          livro.id === id ? { ...livro, disponivel: !disponivel } : livro
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar disponibilidade');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Catálogo de Livros</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Carregando...</p>}
      {tipoUsuario === 'sebo' && (
        <div>
          <input
            type="text"
            placeholder="ID do Livro"
            value={novoLivroId}
            onChange={(e) => setNovoLivroId(e.target.value)}
          />
          <button onClick={handleAddLivro}>Adicionar Livro</button>
        </div>
      )}
      <div>
        <input
          type="text"
          placeholder="Filtrar por título"
          value={filtroTitulo}
          onChange={(e) => setFiltroTitulo(e.target.value)}
        />
        <select
          onChange={(e) =>
            setFiltroDisponivel(e.target.value === '' ? null : e.target.value === 'true')
          }
        >
          <option value="">Todos</option>
          <option value="true">Disponíveis</option>
          <option value="false">Indisponíveis</option>
        </select>
      </div>
      <ul>
        {livros.map((livro) => (
          <li key={livro.id}>
            Livro ID: {livro.livroId} {livro.titulo ? `- ${livro.titulo}` : ''} - Disponível:{' '}
            {livro.disponivel ? 'Sim' : 'Não'}
            {tipoUsuario === 'sebo' && (
              <button onClick={() => handleToggleDisponibilidade(livro.id, livro.disponivel)}>
                Alternar Disponibilidade
              </button>
            )}
            {tipoUsuario === 'leitor' && (
              <button onClick={() => navigate(`/livro/${livro.livroId}`)}>Ver Detalhes</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};