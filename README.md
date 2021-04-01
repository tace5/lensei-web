# Lensei Admin
The Lensei Admin page is to be used for administering the [Lensei app](https://github.com/alestiago/google-solution-challenge). When logged in, admins can add, remove and edit products that can be scanned by the app.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It uses Next.js 10.0.8.

## Author's note
This project has been done as part of [Google Solution Challenge 2021](https://developers.google.com/community/dsc-solution-challenge).

As part of the solution there is a Flutter Application (Check the [repository](https://github.com/alestiago/google-solution-challenge)), a NextJS Website (this repository) and a phsycial product.

This is still under development. Hence, you may encounter bugs (we hope not), but it is possible. You can read more about our future plans at the end of the document.

## Demo Video
You may find our two minute demonstration video [here]().

## Getting Started
1\. Clone the repository.

2\. Run the development server:
```
npm run dev
# or
yarn dev
```
3\. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

4\. Sign in with admin credentials. We don't have a registration page for security reasons but you can use our demo account:

Email: `demo@demo.com`

Password: `demopassword`

5\. Start adding products!

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More
To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/)

## Future Plans
- [ ] Create a dashboard
- [ ] Add a page for app user statistics
- [ ] Make it easier to register new admins
