'use server';

import connectToDatabase from '@/lib/db';
import { Job, FilterOptions } from '@/lib/types';

export async function getJobs(options: FilterOptions) {
  const { query, location, contract, limit, skip } = options;

  try {
    const { db } = await connectToDatabase();
    const filter: Record<string, unknown> = {};
    if (query) {
      filter.$or = [
        { position: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (contract) {
      const contractTypes = contract.split(',').filter(Boolean);
      if (contractTypes.length > 0) {
        filter.contract = { $in: contractTypes };
      }
    }

    const totalCount = await db.collection<Job>('jobs').countDocuments(filter);
    const limitNum = limit ? parseInt(limit) : 12;
    const skipNum = skip ? parseInt(skip) : 0;
    // If we have a skip value, we need to load ALL jobs from beginning up to skip+limit
    const effectiveLimit = skipNum > 0 ? skipNum + limitNum : limitNum;
    const effectiveSkip = 0; // Always start from the beginning

    const mongoData = await db
      .collection<Job>('jobs')
      .find(filter)
      .skip(effectiveSkip)
      .limit(effectiveLimit)
      .sort({ id: 1 })
      .project<Job>({
        id: { $toString: '$_id' },
        _id: 0,
        company: 1,
        logo: 1,
        logoBackground: 1,
        position: 1,
        postedAt: 1,
        contract: 1,
        location: 1,
        website: 1,
        apply: 1,
        description: 1,
        requirements: 1,
        role: 1,
      })
      .toArray();
    const hasMore = totalCount > skipNum + mongoData.length;

    return { jobs: mongoData, totalCount, hasMore };
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    // return { jobs: [], totalCount: 0, hasMore: false };
    throw new Error('Unable to load the available jobs at the moment. Please try again later.');
  }
}

export async function getJobsCount() {
  try {
    const { db } = await connectToDatabase();
    const count = await db.collection<Job>('jobs').countDocuments();
    return count;
  } catch (error) {
    console.error('Failed to fetch jobs count:', error);
    throw new Error('Unable to load the available jobs at the moment. Please try again later.');
  }
}
