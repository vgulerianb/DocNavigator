# DocNavigator

![DocNavigator](https://github.com/vgulerianb/DocNavigator/assets/90599235/3c066058-a383-473b-b31f-676a69b5ebef)

DocNavigator is an AI-powered chatbot builder that is designed to improve the user experience on product documentation/support websites. It can be trained on the data available on the company's website, making it a scalable solution for organizations of any size.

With its ability to handle multiple queries at once, DocNavigator can save customers time and boost productivity, all while improving customer satisfaction.

To get started with this project, you will need to create a `.env` file. An example `.env` file can be found in the `example.env`. The `.env` file accepts the following variables:

- `APP_URL`: The root path where your app is hosted. say https://localhost:3000
- `OPENAI_API_KEY`: The API key for OpenAI.
- `NEXT_PUBLIC_SUPABASE_URL`: The URL for your Supabase instance. //Create new project on supabase for this
- `SUPABASE_SERVICE_ROLE_KEY`: The service role key for your Supabase instance. //Create new project on supabase for this
- `APP_SECRET`: The secret key for signing JWT tokens.
- `USER_SIGNUP_LIMIT`: The limit for additional signups.
- `DATABASE_URL`: The connection string for your Supabase database. //Create new project on supabase for this

Before building and running the Docker container, you will need to initialize the database by running the following command:

```bash
# Initialize the database
yarn run initDb
```

This will create the necessary tables and data in your Supabase database.

Once you have created your `.env` file and initialized the database, you can run the following commands to start the project:

Use docker

```bash
# Build the Docker image
docker build -t doc-navigator .

# Run the Docker container
docker run -p 3000:3000 doc-navigator
```

Or start locally

```bash
# Install dependencies
yarn install

# Build the application
yarn build

# Start the webapp
yarn start
```

This will run the app, exposing port 3000 for the application. You can then access the application by navigating to `http://localhost:3000` in your web browser.

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/my-new-feature`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin feature/my-new-feature`)
6. Create a new Pull Request

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.
