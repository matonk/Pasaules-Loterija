// api/judge.js
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { valsts, dzimums, vieta, ienakumi, iqLimenis, wildcard } = req.body;

    // Construct a highly detailed prompt for realistic socio-economic storytelling
    const prompt = `
    You are a gritty, realistic, socio-economic life simulator. Analyze the life prospects of a person born with these exact parameters:
    - Country: ${valsts}
    - Gender: ${dzimums}
    - Environment: Born in ${vieta}
    - Finances: ${ienakumi}% of the country's population has a higher income than their family (meaning lower numbers are wealthier, higher numbers are poorer).
    - Intelligence: ${iqLimenis || '100'} IQ
    - Life Challenge (Wild Card): ${wildcard ? `${wildcard.title} - ${wildcard.desc}` : 'None'}

    Task: Write a witty, highly realistic, and brutally honest 3-paragraph summary of what their life journey will look like (childhood, education/career prospects, and old age/quality of life). Base your logic on actual geopolitical realities, economic standing, and the severity of their specific challenge.
    
    CRITICAL: Write the entire response in fluent, natural Latvian. Do not break character. Do not use formatting like markdown bolding inside the text, just give pure paragraph breaks.
    `;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // Cost-effective and highly capable
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.8
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to generate AI response');
        }

        return res.status(200).json({ judgment: data.choices[0].message.content });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}