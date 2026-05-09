import { generateText } from 'ai';
import { AppError } from '../errors/AppError.js';

const getRecommendedPostIds = async ({
    interests = [],
    posts = [],
    maxResults = 5,
}) => {
    if (!posts.length || !interests.length) return [];

    // SIMULATION: TEST EXCEPTION
    //  throw new AppError('Simulated AI service failure - test exception', 500);

    const prompt = `
You are a content recommendation engine.

User interests: ${interests.join(', ')}

Posts:
${posts.map(p => `ID:${p._id} | ${p.content?.slice(0, 100)}`).join('\n')}

Return ONLY a valid JSON array of up to ${maxResults} post IDs that are relevant to the user interests.
Only include clearly relevant posts. If none match, return [].
No explanations. No markdown. Only JSON.
    `.trim();

    try {
        const { text } = await generateText({
            model: 'anthropic/claude-sonnet-4-5',
            prompt
        });


        // const match  = text.match(/\[[\s\S]*\]/);
        //if (!match) return [];
        const matches = [...text.matchAll(/\[[\s\S]*?\]/g)]
        if (!matches.length) return [];

        //const parsed = JSON.parse(match[0]);
        const parsed = JSON.parse(matches[matches.length - 1][0]);
        if (!Array.isArray(parsed)) return [];

        const validIds = new Set(posts.map(p => String(p._id)));
        return parsed
            .filter(id => typeof id === 'string' && validIds.has(id))
            .slice(0, maxResults);

    } catch (err) {
        console.error('AI Recommendation Error:', err.message);
        throw new AppError('Failed to fetch recommended posts', 500);
    }
};

export { getRecommendedPostIds };