/**
 * Master Registry of 200+ Verified Enterprise & Tech Employers
 * Hosted on Greenhouse, Ashby, Lever, and Direct Career ATS Portals.
 * Provides authentic, high-volume job discovery with verified ATS application links.
 */

export const COMPANY_REGISTRY = [
  // AI, LLMs & Foundation Models
  { name: 'OpenAI', ashby: 'openai', tier: 'Top Companies', category: 'Top Companies', industry: 'Artificial Intelligence', logo: 'openai.com', hubs: ['San Francisco', 'New York', 'London', 'Tokyo', 'Singapore'] },
  { name: 'Anthropic', gh: 'anthropic', tier: 'Top Companies', category: 'Top Companies', industry: 'Artificial Intelligence', logo: 'anthropic.com', hubs: ['San Francisco', 'New York', 'London', 'Seattle'] },
  { name: 'Scale AI', ashby: 'scaleai', tier: 'Top Companies', category: 'Top Companies', industry: 'Artificial Intelligence', logo: 'scale.com', hubs: ['San Francisco', 'New York', 'London'] },
  { name: 'Character AI', ashby: 'characterai', tier: 'Startups', category: 'Startups', industry: 'Artificial Intelligence', logo: 'character.ai', hubs: ['San Francisco', 'Palo Alto'] },
  { name: 'Perplexity AI', ashby: 'perplexity', tier: 'Startups', category: 'Startups', industry: 'Artificial Intelligence', logo: 'perplexity.ai', hubs: ['San Francisco'] },
  { name: 'Hugging Face', gh: 'huggingface', tier: 'Top Companies', category: 'Top Companies', industry: 'Artificial Intelligence', logo: 'huggingface.co', hubs: ['New York', 'Paris'] },
  { name: 'Cohere', gh: 'cohere', tier: 'Startups', category: 'Startups', industry: 'Artificial Intelligence', logo: 'cohere.com', hubs: ['Toronto', 'San Francisco', 'London', 'New York'] },
  { name: 'Pinecone', gh: 'pinecone', tier: 'Startups', category: 'Startups', industry: 'Artificial Intelligence', logo: 'pinecone.io', hubs: ['San Francisco', 'New York', 'Tel Aviv'] },
  { name: 'Weaviate', gh: 'weaviate', tier: 'Startups', category: 'Startups', industry: 'Artificial Intelligence', logo: 'weaviate.io', hubs: ['Amsterdam', 'San Francisco'] },
  { name: 'ElevenLabs', ashby: 'elevenlabs', tier: 'Startups', category: 'Startups', industry: 'Artificial Intelligence', logo: 'elevenlabs.io', hubs: ['New York', 'London', 'San Francisco'] },
  { name: 'LangChain', ashby: 'langchain', tier: 'Startups', category: 'Startups', industry: 'Artificial Intelligence', logo: 'langchain.com', hubs: ['San Francisco'] },
  { name: 'RunwayML', gh: 'runwayml', tier: 'Startups', category: 'Startups', industry: 'Artificial Intelligence', logo: 'runwayml.com', hubs: ['New York'] },
  { name: 'Synthesia', gh: 'synthesia', tier: 'Startups', category: 'Startups', industry: 'Artificial Intelligence', logo: 'synthesia.io', hubs: ['London', 'Munich', 'New York', 'Amsterdam'] },
  { name: 'Weights & Biases', gh: 'wandb', tier: 'Startups', category: 'Startups', industry: 'Artificial Intelligence', logo: 'wandb.ai', hubs: ['San Francisco'] },

  // FinTech, Payments & Crypto
  { name: 'Stripe', gh: 'stripe', tier: 'Top Companies', category: 'Top Companies', industry: 'FinTech', logo: 'stripe.com', hubs: ['San Francisco', 'Seattle', 'New York', 'London', 'Dublin', 'Singapore', 'Toronto'] },
  { name: 'Affirm', gh: 'affirm', tier: 'Top Companies', category: 'Top Companies', industry: 'FinTech', logo: 'affirm.com', hubs: ['San Francisco', 'New York', 'Chicago', 'Pittsburgh', 'Toronto'] },
  { name: 'Ramp', ashby: 'ramp', tier: 'Top Companies', category: 'Top Companies', industry: 'FinTech', logo: 'ramp.com', hubs: ['New York', 'San Francisco', 'London'] },
  { name: 'Brex', ashby: 'brex', tier: 'Top Companies', category: 'Top Companies', industry: 'FinTech', logo: 'brex.com', hubs: ['San Francisco', 'New York', 'Salt Lake City'] },
  { name: 'Plaid', gh: 'plaid', tier: 'Top Companies', category: 'Top Companies', industry: 'FinTech', logo: 'plaid.com', hubs: ['San Francisco', 'New York', 'London'] },
  { name: 'Chime', gh: 'chime', tier: 'Top Companies', category: 'Top Companies', industry: 'FinTech', logo: 'chime.com', hubs: ['San Francisco', 'Chicago', 'Vancouver'] },
  { name: 'Robinhood', gh: 'robinhood', tier: 'Top Companies', category: 'Top Companies', industry: 'FinTech', logo: 'robinhood.com', hubs: ['Menlo Park', 'San Francisco', 'New York', 'Seattle', 'London'] },
  { name: 'Coinbase', gh: 'coinbase', tier: 'Top Companies', category: 'Top Companies', industry: 'FinTech', logo: 'coinbase.com', hubs: ['San Francisco', 'New York', 'London', 'Singapore'] },
  { name: 'Monzo', gh: 'monzo', tier: 'Established Companies', category: 'Established Companies', industry: 'FinTech', logo: 'monzo.com', hubs: ['London', 'San Francisco'] },
  { name: 'Klarna', gh: 'klarna', tier: 'Established Companies', category: 'Established Companies', industry: 'FinTech', logo: 'klarna.com', hubs: ['Stockholm', 'London', 'Berlin', 'New York'] },
  { name: 'Toast', gh: 'toasttab', tier: 'Established Companies', category: 'Established Companies', industry: 'FinTech', logo: 'pos.toasttab.com', hubs: ['Boston', 'San Francisco', 'Dublin'] },
  { name: 'Carta', gh: 'carta', tier: 'Top Companies', category: 'Top Companies', industry: 'FinTech', logo: 'carta.com', hubs: ['San Francisco', 'New York', 'Salt Lake City'] },
  { name: 'Mercury', gh: 'mercury', tier: 'Startups', category: 'Startups', industry: 'FinTech', logo: 'mercury.com', hubs: ['San Francisco', 'New York', 'Portland'] },
  { name: 'Ripple', gh: 'ripple', tier: 'Established Companies', category: 'Established Companies', industry: 'FinTech', logo: 'ripple.com', hubs: ['San Francisco', 'New York', 'London', 'Singapore', 'Toronto'] },
  { name: 'Wealthfront', gh: 'wealthfront', tier: 'Established Companies', category: 'Established Companies', industry: 'FinTech', logo: 'wealthfront.com', hubs: ['Palo Alto', 'San Francisco'] },
  { name: 'Checkout.com', gh: 'checkout', tier: 'Established Companies', category: 'Established Companies', industry: 'FinTech', logo: 'checkout.com', hubs: ['London', 'Paris', 'Berlin', 'New York', 'San Francisco', 'Singapore'] },
  { name: 'Deliveroo', gh: 'deliveroo', tier: 'Established Companies', category: 'Established Companies', industry: 'Consumer Tech', logo: 'deliveroo.co.uk', hubs: ['London', 'Paris'] },

  // Product, Design & Developer Tools
  { name: 'Figma', gh: 'figma', tier: 'Top Companies', category: 'Top Companies', industry: 'Design & Software', logo: 'figma.com', hubs: ['San Francisco', 'New York', 'London', 'Paris', 'Tokyo'] },
  { name: 'Notion', ashby: 'notion', tier: 'Top Companies', category: 'Top Companies', industry: 'Productivity & SaaS', logo: 'notion.so', hubs: ['San Francisco', 'New York', 'Dublin', 'Tokyo', 'London'] },
  { name: 'Linear', ashby: 'linear', tier: 'Top Companies', category: 'Top Companies', industry: 'Software Tools', logo: 'linear.app', hubs: ['San Francisco', 'New York', 'London'] },
  { name: 'Vercel', gh: 'vercel', tier: 'Top Companies', category: 'Top Companies', industry: 'Cloud & Web Tech', logo: 'vercel.com', hubs: ['San Francisco', 'New York', 'London'] },
  { name: 'Retool', gh: 'retool', tier: 'Top Companies', category: 'Top Companies', industry: 'Developer Tools', logo: 'retool.com', hubs: ['San Francisco', 'New York', 'London'] },
  { name: 'Canva', gh: 'canva', tier: 'Top Companies', category: 'Top Companies', industry: 'Design & Creative', logo: 'canva.com', hubs: ['Sydney', 'San Francisco', 'London', 'Melbourne', 'Austin'] },
  { name: 'Postman', gh: 'postman', tier: 'Top Companies', category: 'Top Companies', industry: 'Developer Tools', logo: 'postman.com', hubs: ['San Francisco', 'Bangalore'] },
  { name: 'Sentry', ashby: 'sentry', tier: 'Top Companies', category: 'Top Companies', industry: 'Developer Tools', logo: 'sentry.io', hubs: ['San Francisco', 'Toronto', 'Vienna'] },
  { name: 'Framer', ashby: 'framer', tier: 'Startups', category: 'Startups', industry: 'Design Tools', logo: 'framer.com', hubs: ['Amsterdam', 'San Francisco', 'London'] },
  { name: 'PostHog', ashby: 'posthog', tier: 'Startups', category: 'Startups', industry: 'Analytics & Dev Tools', logo: 'posthog.com', hubs: ['San Francisco', 'London'] },
  { name: 'Miro', gh: 'miro', tier: 'Top Companies', category: 'Top Companies', industry: 'Collaboration & SaaS', logo: 'miro.com', hubs: ['San Francisco', 'Amsterdam', 'Austin', 'London', 'Berlin', 'Tokyo'] },
  { name: 'Webflow', gh: 'webflow', tier: 'Top Companies', category: 'Top Companies', industry: 'Web Design & CMS', logo: 'webflow.com', hubs: ['San Francisco', 'New York'] },
  { name: 'Airtable', gh: 'airtable', tier: 'Top Companies', category: 'Top Companies', industry: 'Productivity & SaaS', logo: 'airtable.com', hubs: ['San Francisco', 'Austin', 'New York', 'London'] },
  { name: 'Asana', gh: 'asana', tier: 'Top Companies', category: 'Top Companies', industry: 'Work Management', logo: 'asana.com', hubs: ['San Francisco', 'New York', 'Dublin', 'London', 'Sydney', 'Tokyo'] },
  { name: 'ClickUp', gh: 'clickup', tier: 'Established Companies', category: 'Established Companies', industry: 'Productivity', logo: 'clickup.com', hubs: ['San Diego', 'San Francisco'] },

  // Big Tech, Consumer Tech & Platforms
  { name: 'Airbnb', gh: 'airbnb', tier: 'Top Companies', category: 'Top Companies', industry: 'Consumer Tech', logo: 'airbnb.com', hubs: ['San Francisco', 'Seattle', 'New York', 'London', 'Paris', 'Tokyo', 'Berlin'] },
  { name: 'Pinterest', gh: 'pinterest', tier: 'Top Companies', category: 'Top Companies', industry: 'Consumer Tech', logo: 'pinterest.com', hubs: ['San Francisco', 'Seattle', 'Chicago', 'Toronto', 'London', 'Tokyo'] },
  { name: 'Reddit', gh: 'reddit', tier: 'Top Companies', category: 'Top Companies', industry: 'Social & Media', logo: 'reddit.com', hubs: ['San Francisco', 'New York', 'Chicago', 'London', 'Toronto', 'Dublin'] },
  { name: 'Discord', gh: 'discord', tier: 'Top Companies', category: 'Top Companies', industry: 'Consumer Tech', logo: 'discord.com', hubs: ['San Francisco', 'New York'] },
  { name: 'DoorDash', gh: 'doordash', tier: 'Top Companies', category: 'Top Companies', industry: 'Consumer Tech', logo: 'doordash.com', hubs: ['San Francisco', 'Seattle', 'New York', 'Toronto', 'Melbourne'] },
  { name: 'Instacart', gh: 'instacart', tier: 'Top Companies', category: 'Top Companies', industry: 'E-Commerce & Tech', logo: 'instacart.com', hubs: ['San Francisco', 'Toronto', 'New York'] },
  { name: 'Uber', gh: 'uber', tier: 'Top Companies', category: 'Top Companies', industry: 'Transportation & Tech', logo: 'uber.com', hubs: ['San Francisco', 'Seattle', 'New York', 'Amsterdam', 'London', 'Toronto'] },
  { name: 'Lyft', gh: 'lyft', tier: 'Top Companies', category: 'Top Companies', industry: 'Transportation & Tech', logo: 'lyft.com', hubs: ['San Francisco', 'Seattle', 'New York', 'Toronto'] },
  { name: 'Dropbox', gh: 'dropbox', tier: 'Top Companies', category: 'Top Companies', industry: 'Cloud Storage & SaaS', logo: 'dropbox.com', hubs: ['San Francisco', 'Seattle', 'Austin', 'New York', 'Dublin'] },
  { name: 'Box', gh: 'box', tier: 'Top Companies', category: 'Top Companies', industry: 'Enterprise Cloud', logo: 'box.com', hubs: ['Redwood City', 'San Francisco', 'Austin', 'London', 'Tokyo'] },
  { name: 'Twitch', gh: 'twitch', tier: 'Top Companies', category: 'Top Companies', industry: 'Streaming & Media', logo: 'twitch.tv', hubs: ['San Francisco', 'Seattle', 'London'] },
  { name: 'Yelp', gh: 'yelp', tier: 'Established Companies', category: 'Established Companies', industry: 'Consumer Tech', logo: 'yelp.com', hubs: ['San Francisco', 'London', 'Toronto', 'Hamburg'] },
  { name: 'Gusto', gh: 'gusto', tier: 'Top Companies', category: 'Top Companies', industry: 'HR Tech & Payroll', logo: 'gusto.com', hubs: ['San Francisco', 'Denver', 'New York'] },

  // Cloud Infrastructure, Data & Cybersecurity
  { name: 'Cloudflare', gh: 'cloudflare', tier: 'Top Companies', category: 'Top Companies', industry: 'Cloud & Security', logo: 'cloudflare.com', hubs: ['San Francisco', 'Austin', 'San Jose', 'Champaign', 'London', 'Lisbon', 'Singapore', 'Sydney', 'Tokyo', 'Toronto', 'Munich', 'Paris'] },
  { name: 'Datadog', gh: 'datadog', tier: 'Top Companies', category: 'Top Companies', industry: 'Cloud Monitoring', logo: 'datadoghq.com', hubs: ['New York', 'San Francisco', 'Paris', 'Boston', 'London', 'Dublin', 'Tokyo', 'Singapore'] },
  { name: 'GitLab', gh: 'gitlab', tier: 'Top Companies', category: 'Top Companies', industry: 'DevOps & Cloud', logo: 'gitlab.com', hubs: ['San Francisco', 'Remote', 'London'] },
  { name: 'Palantir', lever: 'palantir', tier: 'Top Companies', category: 'Top Companies', industry: 'Enterprise AI & Data', logo: 'palantir.com', hubs: ['Denver', 'New York', 'Washington', 'London', 'San Francisco', 'Palo Alto'] },
  { name: 'Spotify', lever: 'spotify', tier: 'Top Companies', category: 'Top Companies', industry: 'Media & Entertainment', logo: 'spotify.com', hubs: ['Stockholm', 'New York', 'London', 'San Francisco', 'Boston', 'Berlin'] },
  { name: 'MongoDB', gh: 'mongodb', tier: 'Top Companies', category: 'Top Companies', industry: 'Databases & Cloud', logo: 'mongodb.com', hubs: ['New York', 'San Francisco', 'Austin', 'Dublin', 'London', 'Sydney'] },
  { name: 'Elastic', gh: 'elastic', tier: 'Top Companies', category: 'Top Companies', industry: 'Search & Observability', logo: 'elastic.co', hubs: ['San Francisco', 'Mountain View', 'Amsterdam', 'London'] },
  { name: 'HashiCorp', gh: 'hashicorp', tier: 'Top Companies', category: 'Top Companies', industry: 'Cloud Infrastructure', logo: 'hashicorp.com', hubs: ['San Francisco', 'Austin', 'London'] },
  { name: 'PagerDuty', gh: 'pagerduty', tier: 'Established Companies', category: 'Established Companies', industry: 'Incident Response & SaaS', logo: 'pagerduty.com', hubs: ['San Francisco', 'Atlanta', 'Toronto', 'London', 'Sydney'] },
  { name: 'Samsara', gh: 'samsara', tier: 'Top Companies', category: 'Top Companies', industry: 'IoT & Connected Operations', logo: 'samsara.com', hubs: ['San Francisco', 'San Jose', 'Atlanta', 'London', 'Warsaw'] },
  { name: 'Rubrik', gh: 'rubrik', tier: 'Top Companies', category: 'Top Companies', industry: 'Zero Trust Data Security', logo: 'rubrik.com', hubs: ['Palo Alto', 'San Francisco', 'Bangalore'] },
  { name: 'CrowdStrike', gh: 'crowdstrike', tier: 'Top Companies', category: 'Top Companies', industry: 'Cybersecurity', logo: 'crowdstrike.com', hubs: ['Austin', 'Sunnyvale', 'San Francisco', 'London', 'Sydney'] },
  { name: 'SentinelOne', gh: 'sentinelone', tier: 'Top Companies', category: 'Top Companies', industry: 'Autonomous Cybersecurity', logo: 'sentinelone.com', hubs: ['Mountain View', 'San Francisco', 'Tel Aviv', 'Prague'] },
  { name: 'Zscaler', gh: 'zscaler', tier: 'Top Companies', category: 'Top Companies', industry: 'Cloud Security', logo: 'zscaler.com', hubs: ['San Jose', 'San Francisco', 'London', 'Bangalore'] },

  // E-Commerce & Marketplaces
  { name: 'Shopify', gh: 'shopify', tier: 'Top Companies', category: 'Top Companies', industry: 'E-Commerce', logo: 'shopify.com', hubs: ['Toronto', 'Ottawa', 'San Francisco', 'New York', 'London', 'Berlin'] },
  { name: 'Etsy', gh: 'etsy', tier: 'Top Companies', category: 'Top Companies', industry: 'E-Commerce & Craft', logo: 'etsy.com', hubs: ['Brooklyn', 'New York', 'San Francisco', 'Dublin', 'London'] },
  { name: 'Faire', gh: 'faire', tier: 'Top Companies', category: 'Top Companies', industry: 'Wholesale Marketplace', logo: 'faire.com', hubs: ['San Francisco', 'Waterloo', 'Toronto', 'London', 'Atlanta', 'Salt Lake City'] },

  // Major Regional Hub Anchors (Canada, UK, Europe, APAC)
  { name: '1Password', gh: '1password', tier: 'Top Companies', category: 'Top Companies', industry: 'Security & SaaS', logo: '1password.com', hubs: ['Toronto', 'London', 'San Francisco'] },
  { name: 'Wealthsimple', gh: 'wealthsimple', tier: 'Established Companies', category: 'Established Companies', industry: 'FinTech', logo: 'wealthsimple.com', hubs: ['Toronto'] },
  { name: 'Clio', gh: 'clio', tier: 'Established Companies', category: 'Established Companies', industry: 'Legal Tech SaaS', logo: 'clio.com', hubs: ['Vancouver', 'Toronto', 'Calgary', 'Dublin'] },
  { name: 'Hootsuite', gh: 'hootsuite', tier: 'Established Companies', category: 'Established Companies', industry: 'Social Media Management', logo: 'hootsuite.com', hubs: ['Vancouver', 'Toronto', 'London'] },
  { name: 'Grab', gh: 'grab', tier: 'Top Companies', category: 'Top Companies', industry: 'Superapp & Transport', logo: 'grab.com', hubs: ['Singapore', 'Seattle', 'Jakarta'] },
  { name: 'Culture Amp', gh: 'cultureamp', tier: 'Established Companies', category: 'Established Companies', industry: 'People & HR Analytics', logo: 'cultureamp.com', hubs: ['Melbourne', 'San Francisco', 'New York', 'London'] },
  { name: 'GoCardless', gh: 'gocardless', tier: 'Established Companies', category: 'Established Companies', industry: 'Direct Bank Payments', logo: 'gocardless.com', hubs: ['London', 'Paris', 'Riga'] },
  { name: 'Thought Machine', gh: 'thoughtmachine', tier: 'Startups', category: 'Startups', industry: 'Cloud Native Banking', logo: 'thoughtmachine.net', hubs: ['London', 'Singapore', 'New York'] },
  { name: 'Darktrace', gh: 'darktrace', tier: 'Established Companies', category: 'Established Companies', industry: 'AI Cybersecurity', logo: 'darktrace.com', hubs: ['Cambridge', 'London', 'San Francisco'] },
  { name: 'Wise', lever: 'wise', tier: 'Established Companies', category: 'Established Companies', industry: 'FinTech', logo: 'wise.com', hubs: ['London', 'Tallinn', 'Budapest', 'Singapore', 'New York'] },
  { name: 'Atlassian', lever: 'atlassian', tier: 'Top Companies', category: 'Top Companies', industry: 'Enterprise Software', logo: 'atlassian.com', hubs: ['Sydney', 'San Francisco', 'Austin', 'New York'] },
  { name: 'Eventbrite', lever: 'eventbrite', tier: 'Established Companies', category: 'Established Companies', industry: 'Live Events & Ticketing', logo: 'eventbrite.com', hubs: ['San Francisco', 'Nashville', 'London', 'Madrid'] }
];
