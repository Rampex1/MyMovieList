<!-- ABOUT THE PROJECT -->
## About The Project

[![Home Page Screen Shot][product-screenshot]](https://mymovielist-frontend-5fe8963d70a6.herokuapp.com)
URL: https://mymovielist-frontend-5fe8963d70a6.herokuapp.com/home

My Movie List is your personal movie diary to help you keep track of all the movies you have watched. 

Here are the features:
* Search up any movie from a complete movie database (TMDB) and retrieve its details.
* Get movie recommendations of the most trending movies today and watch its trailer
* Add movies to your watchlist while keeping track of their status (Completed, Plan To Watch, In Progress, etc.)
* Rate the movies you have watched

Of course, more features will be coming!



### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

* [![React][React.js]][React-url]
* [![Spring Boot][Spring Boot]][Springboot-url]
* [![MongoDB][MongoDB]][MongoDB-url]



<!-- GETTING STARTED -->
## Getting Started

Here are the instructions to follow in order to set up your project locally.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation


1. Get a free TMDB API Key at [https://developer.themoviedb.org/reference/intro/getting-started](https://developer.themoviedb.org/reference/intro/getting-started)
2. Create a free MongoDB cluster and modify application.properties in the backend with your database's info.
3. Modify application.properies in the backend with your new API key and databse info.
4. Clone the repo
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
5. Install NPM packages
   ```sh
   cd frontend
   npm install
   cd ../
   cd backend
   mvn clean install
   ```
6. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```
7. Start the application
   ```sh
   cd frontend 
   npm start
   cd backend 
   mvn spring-boot:run
   ```

<!-- USAGE EXAMPLES -->
## Usage

1. Browse trending movies
   
![Watchlist Screenshot][watchlist-screenshot]

2. Search for movies
   
![Search Movie][search-movie-screenshot]

3. Get movie details and add to your personal watchlist
   
![Movie Details][movie-details-screenshot]

4. View your watchlist and modify it
   
![Watchlist][watchlist-screenshot]





<!-- ROADMAP -->
## Roadmap

- [x] Deploy Website
- [ ] Fix bugs and responsiveness on phone
- [ ] Create Profile Page with statistics
- [ ] Personalized movie recommendation 
- [ ] Community interaction (Upvotes, reviews, add friends)




<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.



<!-- CONTACT -->
## Contact

David Zhou - [Linkedin](www.linkedin.com/in/david-zhou1) - david.zhou.0110@gmail.com

Project Link: [https://github.com/Rampex1/MyMovieList](https://github.com//Rampex1/MyMovieList)




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[watchlist-screenshot]: images/watchlist.png
[movie-details-screenshot]: images/movie_details.png
[trending-movies-screenshot]: images/trending_movies.png
[search-movie-screenshot]: images/search_movie.png
[product-screenshot]: images/home_page.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Spring Boot]: https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white
[Springboot-url]: https://spring.io/projects/spring-boot
[MongoDB]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com

