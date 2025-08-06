import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/app/stores/authStore';
import { useNavigate } from 'react-router-dom';

const Perfil: React.FC = () => {
  const { token, usuarioId, tipoUsuario, logout } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    cnpj: '',
    tipoLogradouro: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPerfil = async () => {
      if (!usuarioId || !tipoUsuario) return navigate('/login');
      setLoading(true);
      try {
        const endpoint = tipoUsuario === 'leitor' ? `/usuario/leitor/${usuarioId}` : `/usuario/sebo/${usuarioId}`;
        const response = await axios.get(`http://localhost:8080/api${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          nome: response.data.nome,
          email: response.data.email,
          cpf: response.data.cpf || '',
          cnpj: response.data.cnpj || '',
          tipoLogradouro: response.data.endereco?.tipoLogradouro || '',
          logradouro: response.data.endereco?.logradouro || '',
          numero: response.data.endereco?.numero || '',
          bairro: response.data.endereco?.bairro || '',
          cidade: response.data.endereco?.cidade || '',
          uf: response.data.endereco?.uf || '',
          cep: response.data.endereco?.cep || '',
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar perfil');
      }
      setLoading(false);
    };
    fetchPerfil();
  }, [token, usuarioId, tipoUsuario, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const endpoint = tipoUsuario === 'leitor' ? `/usuario/leitor/${usuarioId}` : `/usuario/sebo/${usuarioId}`;
      const payload = {
        nome: formData.nome,
        email: formData.email,
        [tipoUsuario === 'leitor' ? 'cpf' : 'cnpj']: tipoUsuario === 'leitor' ? formData.cpf : formData.cnpj,
        endereco: {
          tipoLogradouro: formData.tipoLogradouro,
          logradouro: formData.logradouro,
          numero: formData.numero,
          bairro: formData.bairro,
          cidade: formData.cidade,
          uf: formData.uf,
          cep: formData.cep,
        },
      };
      await axios.put(`http://localhost:8080/api${endpoint}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Perfil atualizado com sucesso!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar perfil');
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) return;
    setLoading(true);
    try {
      const endpoint = tipoUsuario === 'leitor' ? `/usuario/leitor/${usuarioId}` : `/usuario/sebo/${usuarioId}`;
      await axios.delete(`http://localhost:8080/api${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao excluir conta');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Meu Perfil</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Carregando...</p>}
      <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }}>
        <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        {tipoUsuario === 'leitor' ? (
          <input type="text" name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleChange} />
        ) : (
          <input type="text" name="cnpj" placeholder="CNPJ" value={formData.cnpj} onChange={handleChange} />
        )}
        <input type="text" name="tipoLogradouro" placeholder="Tipo de Logradouro" value={formData.tipoLogradouro} onChange={handleChange} />
        <input type="text" name="logradouro" placeholder="Logradouro" value={formData.logradouro} onChange={handleChange} />
        <input type="text" name="numero" placeholder="Número" value={formData.numero} onChange={handleChange} />
        <input type="text" name="bairro" placeholder="Bairro" value={formData.bairro} onChange={handleChange} />
        <input type="text" name="cidade" placeholder="Cidade" value={formData.cidade} onChange={handleChange} />
        <input type="text" name="uf" placeholder="UF" value={formData.uf} onChange={handleChange} />
        <input type="text" name="cep" placeholder="CEP" value={formData.cep} onChange={handleChange} />
        <button type="submit">Atualizar Perfil</button>
      </form>
      <button onClick={handleDeleteAccount}>Excluir Conta</button>
    </div>
  );
};

export default Perfil;