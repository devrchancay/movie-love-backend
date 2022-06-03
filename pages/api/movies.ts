import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../services/db";

const RESULTS_PER_PAGE = 10;

async function getMovies(req: NextApiRequest, res: NextApiResponse) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const count = await prisma.movie.count();
    const movies = await prisma.movie.findMany({
      skip: (page - 1) * RESULTS_PER_PAGE,
      take: RESULTS_PER_PAGE,
    });

    if (page === 1 && movies.length === 0) {
      res.status(200).json([]);
    }

    if (page > 1 && movies.length === 0) {
      throw new Error("No movies found");
    }

    res.status(200).json({
      Search: movies,
      totalResults: count,
    });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return getMovies(req, res);
    case "POST":
      return res.status(405).end();
    case "PUT":
      return res.status(405).end();
    default:
      return {};
  }
};

export default handler;
