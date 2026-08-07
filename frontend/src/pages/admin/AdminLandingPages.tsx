import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { landingPagesService, type LandingPage } from '../../services/landing-pages.service';

export function AdminLandingPages() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchPages() {
      try {
        const data = await landingPagesService.list();
        if (isMounted) {
          setPages(data);
        }
      } catch (err) {
        console.error('Erro ao carregar landing pages:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPages();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta landing page?')) return;
    try {
      await landingPagesService.delete(id);
      setPages((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Erro ao excluir landing page.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Landing Pages</h1>
        <Link
          to="/admin/landing-pages/nova"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Nova Landing Page
        </Link>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pages.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{p.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">/{p.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        p.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p.active ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <a
                      href={`/l/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline mr-4"
                    >
                      Ver
                    </a>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {pages.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Nenhuma landing page encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}