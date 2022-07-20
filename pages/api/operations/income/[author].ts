import { NextApiRequest, NextApiResponse } from 'next';
import { connect } from '../../../../utils/connection';
import { ResponseFuncs } from '../../../../utils/types';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;
  const catcher = (error: Error) =>
    res.status(400).json({ msg: error.message });
  const author: string = req.query.author as string;
  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      const { Operation } = await connect();
      try {
        const gotOperation = await Operation.find({
          author: author,
          type: 'income',
        });
        if (!gotOperation)
          return res.status(400).json({ msg: 'Operation not found!!' });
        return res.status(200).json(gotOperation);
      } catch (error: any) {
        return res.status(500).json({ msg: error.message });
      }
    },
  };
  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: 'No response for this request!' });
};

export default handler;
