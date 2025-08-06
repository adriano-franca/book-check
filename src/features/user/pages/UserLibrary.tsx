import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/app/stores/authStore';
import { useNavigate } from 'react-router-dom';

export const UserLibrary: React.FC = () => {
  const { token, usuarioId, tipoUsuario } = useAuthStore    ();
  const navigate = useNavigate();
  const [livros, setLivros] = useState([]);
  const [novoLivroId, setNovoLivroId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBiblioteca = async () => {
      if (tipoUsuario !== 'leitor') return navigate('/catalogo');
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/biblioteca', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLivros(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar biblioteca');
      }
      setLoading(false);
    };
    if (token) fetchBiblioteca();
    else navigate('/login');
  }, [token, tipoUsuario, navigate]);

  const handleAddLivro = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/biblioteca', {
        livroId: parseInt(novoLivroId),
        leitorId: usuarioId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNovoLivroId('');
      const response = await axios.get('http://localhost:8080/api/biblioteca', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLivros(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao adicionar livro');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Minha Biblioteca</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Carregando...</p>}
      {tipoUsuario === 'leitor' && (
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
      <ul>
        {livros.map((livro: any) => (
          <li key={livro.id}>
            Livro ID: {livro.livroId}
          </li>
        ))}
      </ul>
    </div>
  );
};