const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");

const responseToDatabase = (Search) =>
  Search.map((movie) => ({
    title: movie.Title,
    year: movie.Year,
    type: movie.Type,
    poster: movie.Poster,
  }));

async function fetchPost(page = 1) {
  let currentPage = page;

  const endpoint = `http://www.omdbapi.com/?apikey=5eec5adc&s=love&y=2020&page=${page}`;

  const firstRequest = await axios.get(endpoint);
  if (firstRequest.status === 200) {
    const totalPages = Math.round(firstRequest.data.totalResults / 10);
    const { Search } = firstRequest.data;
    await prisma.movie.createMany({
      data: responseToDatabase(Search),
    });

    console.log(`Page ${currentPage} of ${totalPages}`);

    if (currentPage < totalPages) {
      currentPage++;
      await fetchPost(currentPage);
    }
  }
}

async function main() {
  await fetchPost();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
