'use server';

import { ObjectId } from 'mongodb';

import connectToDatabase from '@/lib/db';
import { Job, FilterOptions } from '@/lib/types';

export async function getJobs(options: FilterOptions) {
  const { query, location, contract, limit, cursor } = options;

  try {
    const { db } = await connectToDatabase();
    const baseFilter: Record<string, unknown> = {};
    if (query) {
      baseFilter.$or = [
        { position: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }
    if (location) baseFilter.location = { $regex: location, $options: 'i' };
    if (contract) {
      const contractTypes = contract.split(',').filter(Boolean);
      if (contractTypes.length > 0) {
        baseFilter.contract = { $in: contractTypes };
      }
    }

    const totalCount = await db.collection('jobs').countDocuments(baseFilter);
    const limitNum = limit ? parseInt(limit) : 12;
    const cursorFilter =
      cursor && ObjectId.isValid(cursor)
        ? { ...baseFilter, _id: { $lt: new ObjectId(cursor) } }
        : baseFilter;

    const mongoData = await db
      .collection('jobs')
      .find(cursorFilter)
      .sort({ _id: -1 })
      .limit(limitNum + 1)
      .project<Job>({
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
    const hasMore = mongoData.length > limitNum;
    const jobsPage = hasMore ? mongoData.slice(0, limitNum) : mongoData;
    const nextCursor = hasMore ? (jobsPage.at(-1)?._id.toString() ?? null) : null;

    return {
      jobs: jobsPage.map((j) => ({ ...j, _id: j._id.toString() })),
      totalCount,
      hasMore,
      nextCursor,
    };
  } catch (error) {
    console.log('Failed to fetch jobs:', error);
    throw new Error('Unable to load the available jobs at the moment. Please try again later.');
  }
}

export async function getJobsCount() {
  try {
    const { db } = await connectToDatabase();
    const count = await db.collection('jobs').countDocuments();
    return count;
  } catch (error) {
    console.log('Failed to fetch jobs count:', error);
    throw new Error('Unable to load the available jobs at the moment. Please try again later.');
  }
}
