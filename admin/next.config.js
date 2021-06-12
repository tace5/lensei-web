
const API_URL = "http://localhost:3000";

module.exports = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${API_URL}/api/:path*`
            },
        ]
    },
}