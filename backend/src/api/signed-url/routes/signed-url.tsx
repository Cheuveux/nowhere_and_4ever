module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/signed-url',
      handler: 'signed-url.getSignedUrl',
      config: {
        policies: [], // Add auth policies if needed
      },
    },
  ],
};
