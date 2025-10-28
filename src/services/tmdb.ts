import { Filme } from '../types/Filme';

const API_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'f32dd6288cf35b8e0d4445e1fe3d8064';

export const listarFilmesPopulares = async (page = 1): Promise<Filme[]> => {
  const response = await fetch(`${API_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${page}`);
  if (!response.ok) throw new Error('Erro ao buscar filmes populares');

  const data = await response.json();

  return data.results.map((f: any) => ({
    id: f.id,
    titulo: f.title,
    imagem: typeof f.poster_path === 'string'
      ? `https://image.tmdb.org/t/p/w500${f.poster_path}`
      : undefined,
    nota: f.vote_average,
    sinopse: f.overview,
  }));
};

export const buscarFilmes = async (
  query: string,
  page = 1
): Promise<{ results: Filme[]; total: number }> => {
  if (!query) return { results: [], total: 0 };

  const response = await fetch(
    `${API_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=${page}`
  );
  if (!response.ok) throw new Error('Erro ao buscar filmes');

  const data = await response.json();

  const filmes: Filme[] = data.results.map((f: any) => ({
    id: f.id,
    titulo: f.title,
    imagem: typeof f.poster_path === 'string'
      ? `https://image.tmdb.org/t/p/w500${f.poster_path}`
      : undefined,
    nota: f.vote_average,
    sinopse: f.overview,
  }));

  return { results: filmes, total: data.total_results };
};

export const buscarFilmePorId = async (id: number): Promise<Filme> => {
  const response = await fetch(`${API_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`);
  if (!response.ok) throw new Error('Filme não encontrado');

  const data = await response.json();

  return {
    id: data.id,
    titulo: data.title,
    imagem: typeof data.poster_path === 'string'
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : undefined,
    nota: data.vote_average,
    sinopse: data.overview,
  };
};
