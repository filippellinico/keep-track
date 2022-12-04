const knex = require('./../db')

exports.getStatistics = async (req, res) => {
    
    const totalPricesData = await knex('receipts').sum('sum')
    const totalPrices = totalPricesData[0]['sum(`sum`)']

    const avgPricesData = await knex('receipts').avg('sum')
    const avgPrices = avgPricesData[0]['avg(`sum`)']

    const countReceiptsData = await knex('receipts').count('id')
    const countReceipts = countReceiptsData[0]['count(`id`)']

    const avgCountArticlesData = await knex
        .avg('count_articles')
        .from(function() {
            this.count('id as count_articles')
                .from('articles_by_receipts')
                .groupBy('receipt_id')
        })

    const avgCountArticles = avgCountArticlesData[0]['avg(`count_articles`)']

    res.json({
        totalPrices: totalPrices,
        avgPrices: avgPrices,
        countReceipts: countReceipts,
        avgCountArticles: avgCountArticles
    })
}