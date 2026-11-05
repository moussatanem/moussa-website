// Everything on the site that isn't an article lives here.
// Articles are markdown files in /content/posts (see README).

import type { Localized } from '../lib/i18n'

export const site = {
  name: 'Moussa Tayeb Nemiche',
  short: 'Moussa T. Nemiche',
  role: {
    en: 'Soon-to-be DevOps engineer · Co-founder at EKMO',
    fr: 'Futur ingénieur DevOps · Co-fondateur d\'EKMO',
  } satisfies Localized,
  location: 'Reims, France',
  /** Canonical site origin, no trailing slash. Used by robots.txt / sitemap when set. */
  url: 'https://www.nemiche.com',
  github: 'https://github.com/moussatanem',
  linkedin: 'https://www.linkedin.com/in/moussa-tayeb-nemiche-324055278',
  email: 'moussa@nemiche.com',
  cv: '/cv.pdf',
  photo: '/images/image.png',
  // Used for "Edit on GitHub" links under each article.
  repo: 'https://github.com/moussatanem/blog',
  branch: 'main',
  postsDir: 'content/posts',
  upSince: '2026-11-05',
  nowUpdated: '2026-11-05',
}

export type Subtopic = { name: Localized; desc: Localized }
export type Topic = {
  slug: string
  name: Localized
  blurb: Localized
  intro: Localized
  subtopics: Subtopic[]
}

export const topics: Topic[] = [
  {
    slug: 'kubernetes',
    name: { en: 'Kubernetes', fr: 'Kubernetes' },
    blurb: {
      en: 'Clusters, upgrades, networking, CKA prep.',
      fr: 'Clusters, upgrades, réseau, préparation CKA.',
    },
    intro: {
      en: "Most of this comes from a three-node kubeadm cluster I run on Proxmox and rebuild when I break it. I'm working toward the CKA, so expect a bias toward cluster internals: etcd, upgrades, networking, RBAC. Notes marked Draft are unfinished on purpose.",
      fr: "La plupart vient d'un cluster kubeadm à trois nœuds sur Proxmox, que je reconstruis quand je le casse. Je prépare le CKA, donc beaucoup d'internals : etcd, upgrades, réseau, RBAC. Les notes marquées Brouillon sont volontairement inachevées.",
    },
    subtopics: [
      { name: { en: 'Cluster lifecycle', fr: 'Cycle de vie du cluster' }, desc: { en: 'Installing, upgrading and backing up clusters built with kubeadm.', fr: 'Installer, upgrader et sauvegarder des clusters kubeadm.' } },
      { name: { en: 'Networking', fr: 'Réseau' }, desc: { en: 'CNI plugins, NetworkPolicies and DNS inside the cluster.', fr: 'Plugins CNI, NetworkPolicies et DNS dans le cluster.' } },
      { name: { en: 'Storage', fr: 'Stockage' }, desc: { en: 'Volumes, reclaim policies and Longhorn on small disks.', fr: 'Volumes, politiques de reclaim et Longhorn sur petits disques.' } },
      { name: { en: 'Security', fr: 'Sécurité' }, desc: { en: 'RBAC, Pod Security Admission, secrets.', fr: 'RBAC, Pod Security Admission, secrets.' } },
      { name: { en: 'Troubleshooting', fr: 'Dépannage' }, desc: { en: 'Checklists for when pods, nodes or DNS misbehave.', fr: 'Checklists quand les pods, nœuds ou le DNS déraillent.' } },
      { name: { en: 'CKA prep', fr: 'Préparation CKA' }, desc: { en: 'Study plan and the commands worth having in muscle memory.', fr: 'Plan de révision et commandes à avoir en mémoire musculaire.' } },
    ],
  },
  {
    slug: 'linux',
    name: { en: 'Linux', fr: 'Linux' },
    blurb: {
      en: 'systemd, filesystems, the shell, performance.',
      fr: 'systemd, systèmes de fichiers, shell, performance.',
    },
    intro: {
      en: 'Notes from running Linux servers and a Fedora laptop.',
      fr: 'Notes depuis des serveurs Linux et un laptop Fedora.',
    },
    subtopics: [
      { name: { en: 'systemd', fr: 'systemd' }, desc: { en: 'Units, timers and the journal.', fr: 'Units, timers et le journal.' } },
      { name: { en: 'Filesystems', fr: 'Systèmes de fichiers' }, desc: { en: 'ext4, mounts and disks.', fr: 'ext4, mounts et disques.' } },
      { name: { en: 'Shell', fr: 'Shell' }, desc: { en: 'Bash and everyday tools.', fr: 'Bash et outils du quotidien.' } },
      { name: { en: 'Performance', fr: 'Performance' }, desc: { en: 'Finding out where the time goes.', fr: 'Comprendre où part le temps.' } },
    ],
  },
  {
    slug: 'networking',
    name: { en: 'Networking', fr: 'Réseaux' },
    blurb: {
      en: 'DNS, routing, VPNs, mail, packet captures.',
      fr: 'DNS, routage, VPN, mail, captures de paquets.',
    },
    intro: {
      en: "It's always DNS. Sometimes it's routing.",
      fr: "C'est toujours le DNS. Parfois le routage.",
    },
    subtopics: [
      { name: { en: 'DNS', fr: 'DNS' }, desc: { en: 'Resolvers, records and debugging.', fr: 'Résolveurs, records et débogage.' } },
      { name: { en: 'Routing', fr: 'Routage' }, desc: { en: 'Getting packets from here to there.', fr: 'Faire aller les paquets d\'ici à là.' } },
      { name: { en: 'VPN', fr: 'VPN' }, desc: { en: 'WireGuard and friends.', fr: 'WireGuard et compagnie.' } },
      { name: { en: 'Email', fr: 'Email' }, desc: { en: 'SPF, DKIM, DMARC and staying off blocklists.', fr: 'SPF, DKIM, DMARC et rester hors des blocklists.' } },
      { name: { en: 'Captures', fr: 'Captures' }, desc: { en: 'tcpdump and Wireshark.', fr: 'tcpdump et Wireshark.' } },
    ],
  },
  {
    slug: 'security',
    name: { en: 'Security & Forensics', fr: 'Sécurité & Forensic' },
    blurb: {
      en: 'Hardening, incident response, disk and memory forensics.',
      fr: 'Durcissement, réponse à incident, forensic disque et mémoire.',
    },
    intro: {
      en: 'Hardening what I run and practising what to do when it gets broken into.',
      fr: 'Durcir ce que je fais tourner et m\'entraîner à réagir en cas d\'intrusion.',
    },
    subtopics: [
      { name: { en: 'Hardening', fr: 'Durcissement' }, desc: { en: 'Baselines and configuration.', fr: 'Baselines et configuration.' } },
      { name: { en: 'Incident response', fr: 'Réponse à incident' }, desc: { en: 'What to do, in which order.', fr: 'Quoi faire, dans quel ordre.' } },
      { name: { en: 'Disk forensics', fr: 'Forensic disque' }, desc: { en: 'Images, filesystems and timelines.', fr: 'Images, systèmes de fichiers et timelines.' } },
      { name: { en: 'Memory forensics', fr: 'Forensic mémoire' }, desc: { en: 'Volatility and friends.', fr: 'Volatility et compagnie.' } },
    ],
  },
  {
    slug: 'go',
    name: { en: 'Go', fr: 'Go' },
    blurb: {
      en: 'Small tools and CLIs, mostly for ops work.',
      fr: 'Petits outils et CLI, surtout pour l\'ops.',
    },
    intro: {
      en: 'Small, boring Go programs that do one job.',
      fr: 'Petits programmes Go ennuyeux qui font une seule chose.',
    },
    subtopics: [
      { name: { en: 'CLIs', fr: 'CLI' }, desc: { en: 'Command-line tools.', fr: 'Outils en ligne de commande.' } },
      { name: { en: 'Concurrency', fr: 'Concurrence' }, desc: { en: 'Goroutines and channels.', fr: 'Goroutines et channels.' } },
      { name: { en: 'Tooling', fr: 'Outillage' }, desc: { en: 'Builds, linting and releases.', fr: 'Builds, lint et releases.' } },
    ],
  },
  {
    slug: 'ci-cd',
    name: { en: 'CI/CD', fr: 'CI/CD' },
    blurb: {
      en: 'Pipelines, GitHub Actions, migrations, releases.',
      fr: 'Pipelines, GitHub Actions, migrations, releases.',
    },
    intro: {
      en: 'Getting code from a commit to production without surprises.',
      fr: 'Passer du commit à la prod sans mauvaises surprises.',
    },
    subtopics: [
      { name: { en: 'GitHub Actions', fr: 'GitHub Actions' }, desc: { en: 'Workflows and runners.', fr: 'Workflows et runners.' } },
      { name: { en: 'GitLab CI', fr: 'GitLab CI' }, desc: { en: 'Pipelines on GitLab.', fr: 'Pipelines sur GitLab.' } },
      { name: { en: 'GitOps', fr: 'GitOps' }, desc: { en: 'Argo CD and declarative deploys.', fr: 'Argo CD et déploiements déclaratifs.' } },
      { name: { en: 'Database migrations', fr: 'Migrations de base' }, desc: { en: 'Changing schemas without downtime.', fr: 'Changer les schémas sans downtime.' } },
    ],
  },
  {
    slug: 'homelab',
    name: { en: 'Homelab', fr: 'Homelab' },
    blurb: {
      en: 'Proxmox, mini PCs, self-hosting.',
      fr: 'Proxmox, mini PC, self-hosting.',
    },
    intro: {
      en: 'Three mini PCs in a cupboard, and everything I run on them.',
      fr: 'Trois mini PC dans un placard, et tout ce que j\'y fais tourner.',
    },
    subtopics: [
      { name: { en: 'Proxmox', fr: 'Proxmox' }, desc: { en: 'The hypervisor under everything.', fr: 'L\'hyperviseur sous tout le reste.' } },
      { name: { en: 'Hardware', fr: 'Matériel' }, desc: { en: 'What it runs on.', fr: 'Sur quoi ça tourne.' } },
      { name: { en: 'Self-hosting', fr: 'Self-hosting' }, desc: { en: 'Services I run myself.', fr: 'Services que j\'héberge moi-même.' } },
      { name: { en: 'Backups', fr: 'Sauvegardes' }, desc: { en: 'Because I will break it.', fr: 'Parce que je vais casser quelque chose.' } },
    ],
  },
]

export const findTopic = (key?: string) => {
  if (!key) return undefined
  const k = key.toLowerCase()
  return topics.find(
    (t) =>
      t.slug === k ||
      t.name.en.toLowerCase() === k ||
      t.name.fr.toLowerCase() === k,
  )
}

export const now: { k: Localized; v: Localized }[] = [
  {
    k: { en: 'Studying', fr: 'Études' },
    v: {
      en: 'Master 2 Networks & Telecommunications, Applications & Security track (DAS) at Université de Reims Champagne-Ardenne.',
      fr: 'Master 2 Réseaux & Télécommunications, parcours Développement d\'Applications & Sécurité (DAS) à l\'Université de Reims Champagne-Ardenne.',
    },
  },
  {
    k: { en: 'Shipping', fr: 'En prod' },
    v: {
      en: 'EKMO, the CMMS SaaS I co-founded for franchise restaurant networks (Burger King).',
      fr: 'EKMO, le GMAO SaaS que j\'ai co-fondé pour les réseaux de restaurants franchisés (Burger King).',
    },
  },
  {
    k: { en: 'Building', fr: 'En cours' },
    v: {
      en: 'Camanalytics — DevOps and some embedded work on a delivery-fraud detection platform: architecture, deploys and field-to-cloud reliability.',
      fr: 'Camanalytics — DevOps et un peu d\'embarqué sur une plateforme de détection de fraude à la livraison : architecture, déploiements et fiabilité terrain / cloud.',
    },
  },
]

export type Project = {
  id: string
  name: string
  kind: Localized
  period: Localized
  status: Localized
  repo: Localized
  repoUrl?: string
  one: Localized
  problem: Localized
  builtShort: Localized
  built: Localized<string[]>
  stack: string[]
  role: Localized
  /** Slugs of posts in /content/posts. Unknown slugs are ignored. */
  posts: string[]
}

export const projects: Project[] = [
  {
    id: 'ekmo',
    name: 'EKMO',
    kind: { en: 'SaaS', fr: 'SaaS' },
    period: { en: '2025 — now', fr: '2025 — présent' },
    status: { en: 'In production', fr: 'En production' },
    repo: { en: 'Private repository', fr: 'Dépôt privé' },
    one: {
      en: 'Maintenance management (CMMS) SaaS for franchise restaurant networks.',
      fr: 'Logiciel de suivi de la maintenance (GMAO) pour réseaux de restaurants franchisés.',
    },
    problem: {
      en: 'Franchise restaurants run dozens of machines maintained by outside contractors. Requests went through phone calls and spreadsheets, compliance checks were missed, and head office had no view across sites.',
      fr: 'Les restaurants franchisés font tourner des dizaines de machines entretenues par des prestataires. Les demandes passaient par téléphone et tableurs, les contrôles de conformité étaient ratés, et le siège n\'avait aucune vue transverse.',
    },
    builtShort: {
      en: 'The full product end to end: web app, mobile apps, secure hosting, and invoice-reading AI.',
      fr: 'Le produit de A à Z : appli web, applis mobiles, hébergement sécurisé et IA de lecture de factures.',
    },
    built: {
      en: [
        'Built the product from scratch: web application and mobile apps on the App Store and Google Play.',
        'Secure hosting with automated updates and backups.',
        'AI that reads invoices and extracts the useful information automatically.',
        'Onboarded the first customer, a 10-restaurant network, from setup to daily use.',
      ],
      fr: [
        'Création du produit de A à Z : application web et appli mobile sur l\'App Store et Google Play.',
        'Mise en ligne et hébergement sécurisé, avec mises à jour automatisées et sauvegardes.',
        'Intégration d\'une IA qui lit les factures et en extrait automatiquement les informations utiles.',
        'Accompagnement du premier client, un réseau de 10 restaurants, de la mise en place à l\'usage quotidien.',
      ],
    },
    stack: ['NestJS', 'React', 'React Native', 'PostgreSQL', 'Docker', 'GCP', 'AWS'],
    role: {
      en: 'Co-founder, President & Lead Developer.',
      fr: 'Co-fondateur, Président & Lead Developer.',
    },
    posts: [],
  },
]

export type Note = { date: string; title: string; cmd: string; topic: string; subtopic?: string }

/** Short TIL notes. `topic` is a topic slug. */
export const notes: Note[] = []

export const experience: {
  when: Localized
  role: Localized
  org: string
  desc: Localized
}[] = [
  {
    when: { en: '2025 — now', fr: '2025 — présent' },
    role: { en: 'DevOps', fr: 'DevOps' },
    org: 'Camanalytics',
    desc: {
      en: 'Delivery-fraud detection platform. Took part in architecture and deployment, built field-to-cloud communication for edge devices, automated deploys and improved service reliability. Some embedded work on field equipment.',
      fr: 'Plateforme de détection de fraude à la livraison. Participation à la conception de l\'architecture et au déploiement, mise en place d\'outils de communication équipements terrain / cloud, automatisation des déploiements et amélioration de la fiabilité des services. Un peu d\'embarqué sur les équipements terrain.',
    },
  },
  {
    when: { en: 'Apr — Jun 2025', fr: 'Avr. — Juin 2025' },
    role: { en: 'Python Developer Intern', fr: 'Stage Développeur Python' },
    org: 'Laboratoire MATIM · Reims',
    desc: {
      en: 'Automated spectral data processing (ellipsometry); reproducible pipeline with tabular output into PostgreSQL.',
      fr: 'Développement d\'algorithmes de traitement automatisé de données spectrales (ellipsométrie) ; chaîne reproductible avec sortie tabulaire (PostgreSQL).',
    },
  },
  {
    when: { en: 'Apr — Jul 2024', fr: 'Avr. — Juil. 2024' },
    role: { en: 'Developer Intern', fr: 'Stage Développeur' },
    org: 'Université de Reims Champagne-Ardenne · InDiD (Infrastructure Digitale de Demain)',
    desc: {
      en: 'Implemented an ASN.1 protocol in Java and integrated it into a secure V2X (vehicle-to-infrastructure) communication chain.',
      fr: 'Implémentation d\'un protocole ASN.1 en Java ; intégration dans une chaîne de communication sécurisée pour systèmes V2X (véhicule-à-infrastructure).',
    },
  },
  {
    when: { en: '2024 — 2025', fr: '2024 — 2025' },
    role: { en: 'Teaching Assistant', fr: 'Enseignant vacataire' },
    org: 'Université de Reims Champagne-Ardenne · Licence Informatique',
    desc: {
      en: 'Taught computer science and mathematics to first-year undergraduates; technical concepts explained for non-experts.',
      fr: 'Encadrement de cours en informatique et mathématiques (L1) ; pédagogie et vulgarisation de concepts techniques complexes.',
    },
  },
  {
    when: { en: '2025 — now', fr: '2025 — présent' },
    role: {
      en: 'Co-founder, President & Lead Developer',
      fr: 'Co-fondateur, Président & Lead Developer',
    },
    org: 'EKMO SAS · Reims',
    desc: {
      en: 'CMMS for franchise restaurant networks (Burger King). Built the product end to end — web and mobile apps, secure hosting, invoice-reading AI — and onboarded the first 10-restaurant network.',
      fr: 'Logiciel de suivi de la maintenance pour réseaux de restaurants franchisés (Burger King). Produit créé de A à Z — web, mobile, hébergement sécurisé, IA de lecture de factures — et premier client accompagné (10 restaurants).',
    },
  },
]

export const education: { when: Localized; name: Localized; org: Localized }[] = [
  {
    when: { en: '2025 — 2027', fr: '2025 — 2027' },
    name: {
      en: 'Master Networks & Telecommunications',
      fr: 'Master Réseaux & Télécommunications',
    },
    org: {
      en: 'Applications & Security track (DAS) · Université de Reims Champagne-Ardenne',
      fr: 'Parcours Développement d\'Applications & Sécurité (DAS) · Université de Reims Champagne-Ardenne',
    },
  },
  {
    when: { en: '2023 — 2025', fr: '2023 — 2025' },
    name: {
      en: 'Bachelor of Computer Science',
      fr: 'Licence Informatique',
    },
    org: {
      en: 'Université de Reims Champagne-Ardenne',
      fr: 'Université de Reims Champagne-Ardenne',
    },
  },
  {
    when: { en: '2021 — 2023', fr: '2021 — 2023' },
    name: {
      en: 'Classe préparatoire MPI',
      fr: 'Classes préparatoires MPI',
    },
    org: {
      en: 'Lycée Franklin Roosevelt · Reims',
      fr: 'Lycée Franklin Roosevelt · Reims',
    },
  },
]

export type Status = 'Done' | 'In progress' | 'Planned'
export const certs: { when: string; name: string; status: Status }[] = []

export const skills: { area: Localized; items: string }[] = [
  {
    area: { en: 'Languages', fr: 'Langages' },
    items: 'TypeScript / JavaScript (Node.js, NestJS, React, React Native), Python, Go, Java, C/C++, Bash, SQL',
  },
  {
    area: { en: 'Databases', fr: 'Bases de données' },
    items: 'PostgreSQL, MySQL, MongoDB, Redis, Firestore',
  },
  {
    area: { en: 'Architecture', fr: 'Architecture' },
    items: 'REST, gRPC, microservices, distributed systems',
  },
  {
    area: { en: 'Cloud', fr: 'Cloud' },
    items: 'GCP (Artifacts, Buckets, IAM), AWS (Lambda, RDS, VPC, EC2, S3, CloudFront)',
  },
  {
    area: { en: 'Containers', fr: 'Conteneurs' },
    items: 'Docker, Kubernetes, k3s',
  },
  {
    area: { en: 'CI/CD', fr: 'CI/CD' },
    items: 'GitHub Actions, Ansible, Drone CI, Bash',
  },
  {
    area: { en: 'Observability', fr: 'Observabilité' },
    items: 'nginx, , Prometheus, Grafana, Elasticsearch, LangFuse',
  },
]

export const languages: { name: Localized; level: Localized }[] = [
  {
    name: { en: 'French', fr: 'Français' },
    level: { en: 'C2 (bilingual)', fr: 'C2 (bilingue)' },
  },
  {
    name: { en: 'English', fr: 'Anglais' },
    level: { en: 'C1 (fluent)', fr: 'C1 (courant)' },
  },
  {
    name: { en: 'Arabic', fr: 'Arabe' },
    level: { en: 'C2 (native)', fr: 'C2 (langue maternelle)' },
  },
]

export const uses: { name: Localized; items: { k: Localized; v: Localized }[] }[] = [
  {
    name: { en: 'OS & desktop', fr: 'OS & bureau' },
    items: [
      {
        k: { en: 'OS', fr: 'OS' },
        v: { en: 'Arch Linux', fr: 'Arch Linux' },
      },
      {
        k: { en: 'Shell', fr: 'Shell' },
        v: { en: 'zsh', fr: 'zsh' },
      },
    ],
  },
  {
    name: { en: 'Terminal & editor', fr: 'Terminal & éditeur' },
    items: [
      {
        k: { en: 'Terminal', fr: 'Terminal' },
        v: { en: 'Kitty', fr: 'Kitty' },
      },
      {
        k: { en: 'Editor', fr: 'Éditeur' },
        v: {
          en: 'Neovim (Lua config, LSP, Telescope, gruvbox)',
          fr: 'Neovim (config Lua, LSP, Telescope, gruvbox)',
        },
      },
      {
        k: { en: 'IDE', fr: 'IDE' },
        v: { en: 'VS Code — TypeScript / EKMO', fr: 'VS Code — TypeScript / EKMO' },
      },
    ],
  },
  {
    name: { en: 'CLI', fr: 'CLI' },
    items: [
      {
        k: { en: 'VCS', fr: 'VCS' },
        v: { en: 'git', fr: 'git' },
      },
      {
        k: { en: 'Search', fr: 'Recherche' },
        v: { en: 'ripgrep, fd, jq', fr: 'ripgrep, fd, jq' },
      },
      {
        k: { en: 'Containers', fr: 'Conteneurs' },
        v: { en: 'Docker, kubectl', fr: 'Docker, kubectl' },
      },
      {
        k: { en: 'Sessions', fr: 'Sessions' },
        v: { en: 'tmux', fr: 'tmux' },
      },
    ],
  },
]
