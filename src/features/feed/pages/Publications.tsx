import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/app/stores/authStore';
import { useNavigate } from 'react-router-dom';

const Publicacoes: React.FC = () => {
  const { token, usuarioId, tipoUsuario } = useAuthStore();
  const navigate = useNavigate();
  const [publicacoes, setPublicacoes] = useState([]);
  const [novaPublicacao, setNovaPublicacao] = useState('');
  const [novoComentario, setNovoComentario] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicacoes = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/publicacao', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPublicacoes(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar publicações');
      }
      setLoading(false);
    };
    if (token) fetchPublicacoes();
    else navigate('/login');
  }, [token, navigate]);

  const handleAddPublicacao = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/publicacao', {
        texto: novaPublicacao,
        usuarioId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNovaPublicacao('');
      const response = await axios.get('http://localhost:8080/api/publicacao', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPublicacoes(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar publicação');
    }
    setLoading(false);
  };

  const handleAddComentario = async (publicacaoId: number) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/comentario', {
        texto: novoComentario,
        usuarioId,
        publicacaoId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNovoComentario('');
      const response = await axios.get('http://localhost:8080/api/publicacao', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPublicacoes(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao adicionar comentário');
    }
    setLoading(false);
  };

  const handleAddCurtida = async (publicacaoId: number) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/curtida', {
        usuarioId,
        publicacaoId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await axios.get('http://localhost:8080/api/publicacao', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPublicacoes(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao curtir publicação');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Publicações</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Carregando...</p>}
      <div>
        <textarea
          placeholder="Escreva sua publicação"
          value={novaPublicacao}
          onChange={(e) => setNovaPublicacao(e.target.value)}
        />
        <button onClick={handleAddPublicacao}>Publicar</button>
      </div>
      <ul>
        {publicacoes.map((pub: any) => (
          <li key={pub.id}>
            <p>{pub.texto} (por Usuário {pub.usuarioId})</p>
            <div>
              <input
                type="text"
                placeholder="Comentar"
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
              />
              <button onClick={() => handleAddComentario(pub.id)}>Comentar</button>
              <button onClick={() => handleAddCurtida(pub.id)}>Curtir</button>
            </div>
            <ul>
              {pub.comentarios?.map((comentario: any) => (
                <li key={comentario.id}>{comentario.texto} (por Usuário {comentario.usuarioId})</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Publicacoes;