import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../../utils/connection';
import { ResponseFuncs } from '../../../utils/types';
import { authOptions } from '../auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;
  const catcher = (error: Error) => res.status(400).json({ error });

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse, id) => {
      const { Operation } = await connect();
      res.json(await Operation.find({}).catch(catcher));
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
