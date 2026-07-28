export type KeeperDialogue = {
  name: string
  title: string
  lines: string[]
  leaveLine: string
  color: string 
}

export const KEEPER_DIALOGUES: Record<string, KeeperDialogue> = {
  'the-forge': {
    name: 'Kael',
    title: 'Keeper of Creation',
    lines: [
      'So... the Crystal has chosen another Architect.',
      'Creation is more than writing code. Every construct carries the mark of its creator.',
      'Show me what you have forged.',
    ],
    leaveLine: 'A blade is only as valuable as the problems it can solve.',
    color: '#f59e0b',
  },

  'the-archives': {
    name: 'Elyra',
    title: 'Guardian of Knowledge',
    lines: [
      'Every language... every framework... every lesson leaves an imprint upon the Realm.',
      'Knowledge forgotten is never truly lost.',
      'Let us see what you have chosen to preserve.',
    ],
    leaveLine: 'The greatest engineers never stop being students.',
    color: '#06b6d4',
  },

  'the-oracle': {
    name: 'The Oracle',
    title: 'Oracle of the Void',
    lines: [
      'Past... Present... Future...',
      'I have witnessed countless possibilities collapse into darkness.',
      'Yet yours continues to grow brighter.',
      'Tell me... who are you becoming?',
    ],
    leaveLine: 'Destiny is not discovered. It is constructed.',
    color: '#8b5cf6',
  },

  'the-gateway': {
    name: 'Nox',
    title: 'Warden of Infinite Paths',
    lines: [
      'Every opportunity begins with a conversation.',
      'Every collaboration begins with trust.',
      'If you wish to shape worlds beyond this one...',
      '...step through the Gateway.',
    ],
    leaveLine: 'The Realm will remember your journey. Others soon will as well.',
    color: '#ec4899',
  },
}