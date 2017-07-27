const imageShorthand = (req, res) => {
    const oneMonth = 28*24*60*60
    const cacheControl = [
        'public',
        `s-maxage=${oneMonth}`,
        `max-age=${oneMonth}`,
        'stale-while-revalidate=true',
        'stale-if-error=true'
    ]
    return res
        .set({'Cache-Control': cacheControl.join(', ')})
        .redirect(301, `/v1/image?width=${req.params.width}&height=${req.params.height}&format=redirect`)
}

module.exports = imageShorthand