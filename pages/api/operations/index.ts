import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../../utils/connection';
import { ResponseFuncs } from '../../../utils/types';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;
  const catcher = (error: Error) => res.status(400).json({ error });

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Operation } = await connect();
      const limit = req.query.limit;
      const author = req.query.author;
      const category = req.query.category;
      if (limit && author && category) {
        let filteredOperations = await Operation.find({
          author: author,
          category: category,
        })
          .limit(limit as unknown as number)
          .sort({ createdAt: -1 })
          .catch(catcher);
        res.json(filteredOperations);
      } else if (author && category) {
        let filteredOperations = await Operation.find({
          author: author,
          category: category,
        })
          .sort({ createdAt: -1 })
          .catch(catcher);
        res.json(filteredOperations);
      } else if (limit && author) {
        let filteredOperations = await Operation.find({ author: author })
          .limit(limit as unknown as number)
          .sort({ createdAt: -1 })
          .catch(catcher);
        res.json(filteredOperations);
      } else if (limit) {
        let operations = await Operation.find({})
          .limit(limit as unknown as number)
          .catch(catcher);
        res.json(operations);
        console.log(typeof limit);
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
