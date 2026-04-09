import careersData from '@/data/careers.json';

export function mapIqToStandard(uiScore: number) {
  return 70 + (uiScore * 0.75);
}

export function getTopFive(userScores: any, location: string = "Pune") {
  const mappedIq = mapIqToStandard(userScores.iq);
  
  const results = (careersData as any[]).map(job => {
    let matchScore = 0;
    if (mappedIq < job.success_profile.min_iq) return null;
    matchScore += (mappedIq - job.success_profile.min_iq) * 2.5;
    matchScore += (userScores.conscientiousness - job.success_profile.min_c) * 2.0;
    matchScore += (userScores.openness - job.success_profile.min_o) * 1.5;

    if (job.sector === 'Revenue Velocity' || job.sector === 'Legal') {
      matchScore += (60 - userScores.agreeableness) * 1.5;
    }

    if (userScores.neuroticism > 75 && job.burnout_risk_profile.toLowerCase().includes('high')) {
      return null;
    }

    return { ...job, matchScore };
  })
  .filter(Boolean)
  .sort((a, b) => b.matchScore - a.matchScore)
  .slice(0, 3); // Strictly top 3

  return results.map(job => {
    const entryBase = parseInt(job.salaries.entry_lpa.split('-')[0]);
    const premium = parseInt(job.pune_blr_premium?.replace('+', '').replace('%', '')) || 0;
    return {
      ...job,
      adjustedEntrySalary: Math.round(entryBase * (1 + premium / 100))
    };
  });
}
