/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.alexasemijoias.com.br',
    generateRobotsTxt: false, // já criamos manualmente
    exclude: [
        '/admin/*',
        '/login',
        '/cadastro',
        '/minha-conta',
        '/recuperar-senha',
        '/checkout/*',
        '/carrinho',
        '/api/*'
    ],
    generateIndexSitemap: false,
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 7000,
    additionalPaths: async (config) => {
        const result = []
        
        // Importar a configuração do Firebase Admin
        const admin = require('./firebase-admin-config');
        
        try {
            // Buscar todos os produtos ativos no Firestore
            const db = admin.firestore();
            const productsSnapshot = await db.collection('products')
                .where('showProduct', '==', true)
                .get();
            
            // Adicionar URLs para cada produto
            productsSnapshot.forEach((doc) => {
                result.push({
                    loc: `/product/${doc.id}`,
                    lastmod: new Date().toISOString(),
                    changefreq: 'daily',
                    priority: 0.8
                });
            });
        } catch (error) {
            console.error('Erro ao gerar URLs dos produtos:', error);
        }
        
        return result;
    },
}
