import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../../utils/connection';
import { ResponseFuncs } from '../../../utils/types';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;
  const catcher = (error: Error) => res.status(400).json({ error });

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Operation } = await connect();
      const author = req.query.author;
      const category = req.query.category;
      const ITEMS_PER_PAGE = 5;
      const page = req.query.page;
      const skip = ((page as unknown as number) - 1) * ITEMS_PER_PAGE;
      if (page && author && category) {
        try {
          const query = { author: author, category: category };
          const count = await Operation.count(query);
          const items = await Operation.find(query)
            .sort({ createdAt: -1 })
            .limit(ITEMS_PER_PAGE)
            .skip(skip);
          const pageCount = Math.ceil(count / ITEMS_PER_PAGE);
          res.status(200).json({ pagination: { count, pageCount }, items });
        } catch (error) {
          res.status(400).json({ error });
        }
      } else if (page && author) {
        try {
          const query = { author: author };
          const count = await Operation.count(query);
          const items = await Operation.find(query)
            .sort({ createdAt: -1 })
            .limit(ITEMS_PER_PAGE)
            .skip(skip);
          const pageCount = Math.ceil(count / ITEMS_PER_PAGE);
          res.status(200).json({ pagination: { count, pageCount }, items });
        } catch (error) {
          res.status(400).json({ error });
        }
      } else if (author && category) {
        let filteredOperations = await Operation.find({
          author: author,
          category: category,
        })
          .sort({ createdAt: -1 })
          .catch(catcher);
        res.json(filteredOperations);
      } else if (author) {
        let operationsAuthor = await Operation.find({ author: author }).catch(
          catcher
        );
        res.json(operationsAuthor);
      } else res.json(await Operation.find({}).catch(catcher));
    },
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Operation } = await connect();
      res.json(await Operation.create(req.body).catch(catcher));
    },
  };
  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: 'No response for this request!' });
};

export default handler;
