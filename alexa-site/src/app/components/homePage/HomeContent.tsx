// src/app/components/homePage/HomeContent.tsx


// Função para buscar as seções (única chamada)

// Agora a função recebe as seções já carregadas (evitando duplicação)



  
// Cache (revalidate) – os dados serão revalidado a cada 60 segundos
export const revalidate = 60;
  
export default async function HomeContent() {
    // Busca as seções primeiro

  
    return (
        <div className="bg-[#FAF9F6] text-[#333333] min-h-screen w-full">
            Olá
        </div>
    );
}