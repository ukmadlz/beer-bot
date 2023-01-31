// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Untappd from '../../../../utils/untappd'
import { getUser } from '../../../../utils/supabase';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if(!req.query.userId) return res.status(500)
  const { data, error } = await getUser(String(req.query.userId));
  if (error) return res.status(500).json({
    name: 'Error finding user',
  })
  const { username } = data[0];
  const untappd = new Untappd({});
  const response = await untappd.currentBeerStatement(username)
  res.status(200).json({ ...response })
}
