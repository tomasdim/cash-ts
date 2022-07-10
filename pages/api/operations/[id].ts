import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../../utils/connection';
import { ResponseFuncs } from '../../../utils/types';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;
  const catcher = (error: Error) => res.status(400).json({ error });
  const id: string = req.query.id as string;
  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Operation } = await connect();
      res.json(await Operation.findById(id).catch(catcher));
    },
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Operation } = await connect();
      res.json(
        await Operation.findByIdAndUpdate(id, req.body, { new: true }).catch(
          catcher
        )
      );
    },
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Operation } = await connect();
      res.json(await Operation.findByIdAndRemove(id).catch(catcher));
    },
  };
  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: 'No response for this request!' });
};

export default handler;
