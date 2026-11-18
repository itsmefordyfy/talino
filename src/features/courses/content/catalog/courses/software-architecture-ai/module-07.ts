import type { Lesson, Project, SourceLink } from '../../../types';

// Module 7: Cloud Architecture and Infrastructure Design (lessons 24 to 26) and Project 1, Design a Multi-Tenant SaaS Architecture. Written 2026-11-18.
// Cloud is taught as concepts that hold on AWS, Azure and Google Cloud. Product names appear only as examples in tables where the writer was certain of them.
// There is no price, free-tier amount, quota or limit anywhere. Every product fact is a dated version note whose official page was read on 2026-11-18.
// Everything in the examples (TindaTrack, StoreDesk, the people, the numbers) is invented; the numbers are small, labelled illustrations, not measurements.
// Demos ("AI in Action") are hand-written illustrations with a flaw to catch, never a model's real output.

const CHECKED = '2026-11-18';
const DOCS: Record<'azureZones' | 'gcpRegions' | 'docker' | 'kubernetes', SourceLink> = {
  azureZones: { label: 'Microsoft Learn: What are Azure availability zones?', url: 'https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview' },
  gcpRegions: { label: 'Google Cloud: Geography and regions', url: 'https://docs.cloud.google.com/docs/geography-and-regions' },
  docker: { label: 'Docker Docs: What is a container?', url: 'https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/' },
  kubernetes: { label: 'Kubernetes Docs: Overview', url: 'https://kubernetes.io/docs/concepts/overview/' },
};

export const lessons: Lesson[] = [
  {
    id: 'software-architecture-ai-24',
    day: 24,
    title: 'Cloud Fundamentals: Compute, Storage and Networking Across Providers',
    summary: 'Learn the building blocks every cloud sells, what a region and an availability zone protect you from, and how to place a system without buying more than it needs.',
    intro: {
      objectives: [
        'Name the compute, storage and networking blocks a cloud offers and the job each one does',
        'Explain what an availability zone protects against and what it does not',
        'Place a small system in one region across two zones, and say what the simpler option was',
      ],
      why: 'Almost every system you design will run on rented infrastructure. If you know the few building blocks and their failure limits, you can read any provider\'s catalogue and choose with reasons instead of by habit.',
    },
    minutes: 24,
    skills: ['arch-cloud'],
    body: [
      { type: 'paragraph', text: `"The cloud" is a short way to say that you rent computing instead of owning it. You do not buy a server and plug it in. You ask a provider for a machine, a disk or a database, use it, and give it back when you do not need it. For an architect the interesting question is not which provider is best. It is which building blocks the design needs, how many of them, and where they should sit. The three big providers (Amazon Web Services, Microsoft Azure and Google Cloud) sell very similar blocks under different names, so what you learn here carries across all three.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Mika built TindaTrack, the inventory and sales app for small neighbourhood stores, and today it serves about 200 stores. It runs on one rented server in one data centre, with the database on the same machine and receipt photos saved on its disk. One evening the data centre's network link failed for several hours. Nothing was broken inside Mika's server, but nobody could reach it. Store owners could not record sales, so they wrote them on paper and typed them in the next day. Some mistyped, and the stock counts were wrong for a week.` },
      { type: 'paragraph', text: `Mika's first idea was to "move to the big cloud and make everything redundant". That would have been expensive and slow. The real lesson was smaller: the whole system had one failure domain, one place where a single event can stop everything. Cloud building blocks let you pick how many failure domains you want. You pay for each extra one with money and with moving parts, so you choose on purpose.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `Think of a rented market stall. You do not build the market. You rent a stall, plug into the market's electricity and water, and pay for what you use. If the market loses power, every stall is dark, no matter how well you run yours. A cloud provider's regions and zones are about choosing which market, and how many, to rent stalls in.` },
      { type: 'paragraph', text: `Cloud blocks fall into three families. **Compute** runs your code: a virtual machine (a computer simulated on a larger physical one that you can start and stop in minutes), a managed platform that runs your app for you, containers, or small functions that run only when called. **Storage** keeps data: object storage keeps files by name, grows without a size plan and is cheap for photos and exports, but you replace a whole file rather than edit it in place; block storage is a disk attached to one machine; a managed database stores structured data and the provider handles patching and backups. **Networking** connects them: a private network that holds your servers, firewall rules that decide who may talk to whom, DNS (the system that turns a name into an address) and a load balancer that spreads requests across servers.` },
      {
        type: 'table',
        headers: ['Building block', 'Amazon Web Services', 'Microsoft Azure', 'Google Cloud'],
        rows: [
          ['Virtual machine', 'Amazon EC2', 'Azure Virtual Machines', 'Compute Engine'],
          ['Object storage', 'Amazon S3', 'Azure Blob Storage', 'Cloud Storage'],
          ['Managed relational database', 'Amazon RDS', 'Azure SQL Database or Azure Database for PostgreSQL', 'Cloud SQL'],
          ['Private network', 'Amazon VPC', 'Azure Virtual Network', 'VPC network'],
          ['DNS', 'Amazon Route 53', 'Azure DNS', 'Cloud DNS'],
          ['Load balancer', 'Elastic Load Balancing', 'Azure Load Balancer', 'Cloud Load Balancing'],
        ],
        caption: 'The same idea under three sets of names. Products get renamed and added, so treat this as a map for reading each provider\'s catalogue, and confirm names in the provider\'s own documentation.',
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: a provider owns huge buildings full of computers. You rent a small piece of them. Compute is the rented brain that runs your program. Storage is the rented cupboard where files and data are kept. Networking is the rented set of doors and corridors, with locks, so that only the right visitors reach the right room. A region is a big area, such as a part of a country, where the provider has these buildings. Because the buildings can lose power or internet, the provider lets you rent in more than one separate building group, and you decide whether your app needs that.` },
      { type: 'paragraph', text: `**Regions and availability zones.** A region is a geographic area where the provider runs data centres. Inside a region, an availability zone (Google Cloud simply says zone) is a separate group of data centres with its own power, cooling and networking, so a failure in one zone should not stop the others. Treat a zone as one failure domain. Two limits matter. Some regions have no zones at all. And zones do not protect you from a whole-region outage; that is a different problem, which lesson 30 returns to under disaster recovery.` },
      { type: 'version', text: `Azure describes availability zones as separated groups of data centres inside a region with independent power, cooling and networking, notes that not every region offers them, and says zones do not protect against an outage of the whole region. Google Cloud describes a region as an independent geographic area made of zones and says a zone should be treated as a single failure domain. Check the provider's page for the region you plan to use, because zone support differs by region and by service.`, checked: CHECKED, sources: [DOCS.azureZones, DOCS.gcpRegions] },
      { type: 'paragraph', text: `Now place TindaTrack. Choose the region by where the users are (nearer means faster), by any rules about where data may be kept, and by whether the services you need exist there. Then choose how many zones. The usual first step is **one region, two zones**: two small app servers, one in each zone, behind a load balancer, and a managed database with a standby copy in the second zone. Receipt photos move to object storage, so no single server holds the only copy. Going to several regions is a much larger step: data must be copied between them, deployments get harder, and consistency questions from the database module come back. Take it only when a written requirement says one region is not enough.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A[Store owner phone] --> B[DNS name]
  B --> C[Load balancer]
  C --> D[App server in zone A]
  C --> E[App server in zone B]
  D --> F[(Database primary in zone A)]
  E --> F
  F -.->|copies data| G[(Database standby in zone B)]
  D --> H[Object storage for receipt photos]
  E --> H`,
        caption: 'TindaTrack in one region and two zones. Look for the single points: the load balancer and object storage are provider-managed and span zones, while the database primary sits in one zone and relies on the standby to take over.',
      },
      { type: 'paragraph', text: `Be honest about the simpler option. If the requirement from lesson 6 says "a few hours of downtime in a rare incident is acceptable", one server with tested backups and a written way to rebuild it may meet the need at a fraction of the cost and effort. The two-zone design buys faster recovery from a zone problem. It costs more money, more pieces to patch and monitor, and one more thing that can be misconfigured. Write the requirement down, then buy only what it demands.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In a large or existing system the questions are about correlated failure. Servers in two zones still share your own deployment, your configuration and often the provider's control plane (the service that starts and stops resources), so a bad release or an expired certificate takes both down together. Zonal resources, such as a single disk or a database primary, stay tied to one zone, and your plan must say who fails them over and how long that takes. Capacity can be tight in a zone during an incident, so pre-provisioned spare capacity and tested failover matter more than a diagram. Cross-zone traffic and managed-service tiers are usually billed in ways that surprise teams, so check how your provider bills them before you spread chatty components across zones.` },
      { type: 'tip', audience: { min: 'intermediate', max: 'intermediate' }, text: 'If you have deployed an app to a host, you used cloud ideas already: compute that runs your code, storage that keeps files, and a network that connects them. The architecture question is which of those you run yourself and which you rent, and what that does to cost, failure and the work your team takes on.' },
      { type: 'heading', text: 'AI in Action' },
      { type: 'demo', title: 'A cloud design that answers a requirement nobody wrote', prompt: `I am designing TindaTrack, an inventory and sales app for small neighbourhood stores. About 200 stores today, mostly in one part of the country, a few hundred requests a minute at peak. Owners can accept up to one hour of downtime in a rare incident, but must not lose recorded sales. We are a team of two developers. Propose a cloud architecture and the building blocks to use.`, output: `Since TindaTrack needs five-nines availability, I recommend an active-active deployment in three regions on Kubernetes, with a globally distributed database, a service mesh and a dedicated platform team. Receipt photos go in object storage with cross-region replication. Use a managed message broker between every service. This design will scale to millions of stores.`, notice: `Look for what the answer invented and what it ignored. "Five-nines availability" appears nowhere in the prompt, which allows an hour of downtime in a rare incident. Three regions, Kubernetes, a service mesh and a platform team are far beyond a team of two serving 200 stores. The one thing it got right, object storage for photos, is the cheap idea. Ask the assistant which stated requirement each component serves, and cut every component that has none.` },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Write your own placement decision first: for a system you know, list the compute, storage and networking blocks you would use, and how many zones. Then ask an assistant to attack your decision, not to replace it.` },
      { type: 'prompt', label: 'Placement review', text: `Here is my system: [describe it in three or four sentences: users, where they are, data it keeps].\n\nMy stated requirements: [downtime I can accept, data I must never lose, team size, rules about where data may be kept].\n\nMy decision: [regions, zones, compute, storage, database, networking blocks, in a short list].\n\nAct as a critical reviewer. 1) List the assumptions you think I made. 2) For each block, name the requirement that justifies it, or say there is none. 3) Name the single points of failure that remain. 4) Describe a simpler option and what it would cost me in risk. 5) Say which of your points you cannot judge from what I wrote. Do not rewrite my design.` },
      { type: 'paragraph', text: `Check three things. Did the assistant tie every block to a requirement you actually wrote? Did it invent a target such as an availability figure you never stated? And do the remaining single points of failure match what your own diagram shows? The decision stays yours.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Draw your own system with the building blocks above and circle every single point of failure.',
        'Read the provider documentation pages in the version note for the region you would really use, and note whether it has zones.',
        'Next, lesson 25 packages your code with containers and writes the infrastructure down as code.',
        'Open the Architecture Assistant (Tali) and ask it to question your placement decision.',
      ] },
      { type: 'visual', id: 'arch-assistant', caption: 'Describe your placement decision and ask Tali to find the assumptions behind it.' },
      { type: 'takeaways', items: [
        'Cloud means renting building blocks. The design questions are which blocks, how many and where, not which provider.',
        'Compute runs code, storage keeps data (object, block, managed database) and networking connects and protects them. The three big providers sell equivalent blocks.',
        'A zone is a failure domain inside a region. Two zones protect against one zone failing, not against a bad release or a whole-region outage.',
        'One region and two zones is a sensible first step for availability. Several regions need a written requirement, because data copying and operations get much harder.',
        'Always say what the simpler option was and what risk it leaves, then buy only what the written requirement demands.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-24-match-1',
          kind: 'match',
          title: 'Which building block fits?',
          prompt: 'Match each need in TindaTrack to the cloud building block that suits it best.',
          concept: 'cloud building blocks',
          labels: { terms: 'The need', meanings: 'The building block' },
          pairs: [
            { term: 'Receipt photos are written once and read many times, and the pile keeps growing.', definition: 'Object storage', note: 'Photos are whole files that grow without a plan, so keeping them by name in object storage fits better than a disk.' },
            { term: 'Two developers do not want to patch and back up a database engine themselves.', definition: 'A managed database', note: 'This is a buy-versus-run choice for structured data; the provider handles patching and backups.' },
            { term: 'Only the app servers may reach the database, never the open internet.', definition: 'A private network with firewall rules', note: 'This is a networking question: who may talk to whom, not where data is stored.' },
            { term: 'A fault at one group of data centres must not stop the app.', definition: 'Servers in a second availability zone', note: 'A second zone is a second failure domain; a bigger server or more storage would not help.' },
          ],
          hints: [
            'Ask which family each need belongs to: running code, keeping data, or connecting and protecting.',
            'One need is about who may talk to whom. Another is about surviving the loss of a place.',
            'Match by the job, not by the name of a product.',
          ],
          explanation: 'Each need points at one block. Naming the family first (compute, storage, networking, or placement across zones) narrows the choice quickly and works the same on any provider.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-24-scenario-1',
          kind: 'scenario',
          title: 'Where do the receipt photos live?',
          prompt: 'Choose where TindaTrack should keep owners\' receipt photos once there are two app servers.',
          concept: 'storage choices',
          situation: 'Today receipt photos are saved on the one server\'s disk. Mika is about to add a second app server in another zone behind a load balancer. An owner uploads a photo, and the next request lands on the other server.',
          options: [
            { text: 'Move the photos to object storage and store only the file name in the database row.', consequence: 'Both servers read the same photos, a replaced server loses nothing, and the database stays small. The cost is one more service to configure and permissions to set.', quality: 'best' },
            { text: 'Store the photo bytes inside the database table.', consequence: 'It works and both servers see the photo. But the database grows quickly, backups get heavy, and every photo read competes with sales queries.', quality: 'acceptable' },
            { text: 'Keep the photos on each server\'s own disk and copy them between servers every night.', consequence: 'An owner uploads a photo, the next request hits the other server, and the photo is missing until the copy runs. Support tickets follow.', quality: 'poor' },
            { text: 'Pin each owner to one server so their photos are always found there.', consequence: 'If that server fails, those owners lose their photos and the load balancer can no longer spread work. A second zone gave no protection.', quality: 'poor' },
          ],
          hints: [
            'After the second server arrives, a request can land on either one. Where must a photo live so both can find it?',
            'Think about what happens when a server is replaced. What should survive?',
            'Look for the option that keeps large files out of the database and off any one server.',
          ],
          explanation: 'Files that every server must reach, and that must survive a server being replaced, belong in shared storage. Object storage is the usual block. Keeping the bytes in the database is a workable compromise at small scale, and local disks break as soon as there are two servers.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-24-tap-reveal-1',
          kind: 'tap-reveal',
          title: 'What survives?',
          prompt: 'Tap each failure to reveal what a one-region, two-zone TindaTrack still does.',
          concept: 'failure domains',
          hints: [
            'Each card is a different failure domain: a server, a zone, your own release, a region.',
            'Before you tap, guess which of the four a second zone helps with.',
            'Two of the four are not helped by a second zone at all.',
          ],
          cards: [
            { front: 'One app server crashes', back: 'The load balancer stops sending it requests and the other server keeps working, if it can carry the load. This is the case two servers are for.' },
            { front: 'All of zone A loses power', back: 'The app server in zone B keeps serving. The database standby in zone B must be promoted, so recovery depends on how fast and how well that failover was tested.' },
            { front: 'A bad release is deployed to both servers', back: 'Both servers fail together. Zones do not protect against your own mistakes; rollbacks and gradual releases do (lesson 44).' },
            { front: 'The whole region has an outage', back: 'Everything is down, unless you planned for another region. That costs far more, so it needs a written requirement and appears under disaster recovery in lesson 30.' },
          ],
          explanation: 'Each failure has a different domain: a server, a zone, your own deployment or a region. Two zones only help with the first two, which is why it is a measured step and not a guarantee.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-24-q1',
        prompt: 'Mika\'s single server was unreachable for hours because the data centre\'s link failed. Which requirement should decide how much to change?',
        choices: [
          'The provider with the most services, because a bigger catalogue means fewer outages for any app.',
          'How much downtime owners can accept in a rare incident and how much recorded data they must never lose.',
          'The number of regions available, because more regions always means higher availability for a small app.',
          'The size of the server, since a larger machine can ride through a network problem at the data centre.',
        ],
        answer: 1,
        explanation: 'Placement follows the written downtime and data-loss requirements. A catalogue size, a region count or a bigger machine do not change the failure domain the incident exposed.',
      },
      {
        id: 'software-architecture-ai-24-q2',
        prompt: 'A teammate says, "We are in two zones, so a bad deployment cannot take us down." What is the most accurate reply?',
        choices: [
          'Correct, because each zone has its own power, cooling and networking, so a release made to one zone cannot reach the other zone, and every rollout stays contained.',
          'Mostly correct, because the provider rolls updates out one zone at a time and so your own releases are protected as well.',
          'Wrong, because zones only protect against a whole region failing, which is the only event they are designed for.',
          'Wrong, because both zones run your code and configuration, so a bad release reaches both; zones protect infrastructure, not your own changes.',
        ],
        answer: 3,
        explanation: 'A zone is a failure domain for the provider\'s infrastructure. Your code and configuration are the same in both, so a faulty release is a correlated failure that only careful releases and rollbacks address.',
      },
      {
        id: 'software-architecture-ai-24-q3',
        prompt: 'An assistant proposes three regions for 200 stores with an allowed hour of downtime. What is the best next move?',
        choices: [
          'Ask which written requirement needs three regions, and keep the design to one region and two zones unless one is found.',
          'Accept it, because an architect who adds more redundancy than needed has still avoided the risk of downtime.',
          'Ask it to add a fourth region so a whole-region outage and a second outage cannot hit together.',
          'Ask for a cheaper provider, since the three-region idea is fine and only the bill is the problem for a small team that has other things to build.',
        ],
        answer: 0,
        explanation: 'Every component should trace to a requirement. Without one, the extra regions only add data-copy, deployment and operations cost, and the simpler design already meets the stated need.',
      },
      {
        id: 'software-architecture-ai-24-q4',
        prompt: 'TindaTrack now runs two app servers behind a load balancer. Where should uploaded receipt photos be stored?',
        choices: [
          'On the disk of whichever server received the upload, copied to the other server once a day to save effort.',
          'In a folder on the load balancer, since it sees every request and can hand the file to either server.',
          'In shared object storage that both servers can read, with only the file name saved in the database.',
          'In the memory of the app server, since memory is faster to read than any disk or storage service.',
        ],
        answer: 2,
        explanation: 'Both servers must find the same file and a replaced server must lose nothing, so shared storage fits. A load balancer routes traffic, it does not store files, and memory disappears on restart.',
      },
      {
        id: 'software-architecture-ai-24-q5',
        audience: { max: 'beginner' },
        prompt: 'In the market stall comparison, what does "renting in two separate buildings" stand for?',
        choices: [
          'Using two availability zones, so a power cut in one building group does not stop the other.',
          'Paying two providers for the same service, so that each one checks the other for mistakes.',
          'Buying two copies of the app so that every owner gets a private version.',
        ],
        answer: 0,
        explanation: 'Two separate buildings stand for two availability zones: separate failure domains in the same area.',
      },
      {
        id: 'software-architecture-ai-24-q6',
        audience: { min: 'advanced' },
        prompt: 'A system runs app servers in two zones and a database primary in one of them. Which question matters most for the failover plan?',
        choices: [
          'Whether the two zones use the same brand of server hardware as each other.',
          'Whether the application has more than one programming language in use at the moment.',
          'Who promotes the standby, how long that takes, and whether it has ever been practised under load.',
          'Whether the load balancer\'s logs are kept for longer than the database\'s own logs are, and how both are searched.',
        ],
        answer: 2,
        explanation: 'The zonal database primary is the part that needs a decision and a procedure. An untested failover is a hope, not a design.',
      },
    ],
    task: {
      title: 'Place a system and find its single points',
      minutes: 18,
      steps: [
        'Pick a system you know (your own app, or TindaTrack). Write its downtime tolerance and the data you must never lose in two sentences.',
        'List the building blocks you would use for compute, storage and networking, and say which region and how many zones.',
        'Draw it as a small diagram (the Architecture Diagram Workbench works) and circle every single point of failure.',
        'Write one line for each circle: accept it, or fix it, and what the fix costs in money and moving parts.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Use a school or shop app you know. Skip the providers and just name the three families: where code runs, where data is kept, who may connect. Then ask yourself what stops if the building loses power.'] },
      { audience: { min: 'advanced' }, steps: ['For your real system, list the correlated failures that survive a second zone (shared release, shared certificate, shared control plane, shared dependency). For the top two, write the detection signal and the first recovery step.'] },
    ],
  },
  {
    id: 'software-architecture-ai-25',
    day: 25,
    title: 'Containers, Orchestration and Infrastructure as Code, and the 12-Factor App',
    summary: 'Package an app so it runs the same everywhere, decide honestly whether you need an orchestrator, write infrastructure down as reviewable code, and use the 12-Factor App as a checklist.',
    intro: {
      objectives: [
        'Explain what a container is and how it differs from a virtual machine and from a serverless function',
        'Decide whether a system needs an orchestrator such as Kubernetes, and name what it would cost',
        'Describe how Infrastructure as Code is reviewed, why its state needs care, and what drift is',
        'Use the twelve factors to find what makes an app hard to run in a container',
      ],
      why: 'Most "it works on my machine" outages and most mystery servers come from how code is packaged and how infrastructure is built, not from the code itself. These four ideas make deployments repeatable and reviewable.',
    },
    minutes: 28,
    skills: ['arch-cloud'],
    body: [
      { type: 'paragraph', text: `Lesson 24 decided where the blocks live. This lesson is about how your code and your infrastructure get there the same way every time. Four ideas work together: a container packages the app, an orchestrator (a program that runs many containers for you) decides where they run, Infrastructure as Code writes the surrounding servers, networks and databases as text, and the 12-Factor App is a checklist for building an app that behaves well in all of that. For each one, this lesson also says when you can skip it.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `When Mika added the second TindaTrack server, the app started on server A but crashed on server B. Server B had a different version of the language runtime, and a setting that Mika had typed by hand on server A was missing. While fixing it, she changed a firewall rule in the provider's web console to let the new server reach the database. Two weeks later Ben, a new developer, tried to build a test environment and could not: nobody remembered which rules had been clicked in, or in what order. A later hand edit of the same rule cut the app off from its database for an evening.` },
      { type: 'paragraph', text: `The cost was not one big failure but steady friction: two lost evenings, one outage, and an environment that only Mika half understood. The fix was not Kubernetes. It was to package the app so it carries its own dependencies, and to write the infrastructure in a file that other people can read and review.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `**Containers.** A container image is a sealed package holding your app and everything it needs to run, such as its runtime and libraries. A container is a running copy of that image. Think of a lunchbox: the meal, the cutlery and the napkin travel together, so it does not matter which table you sit at. A virtual machine, by contrast, includes a whole operating system. A container shares the host machine's operating system kernel and isolates only your app's processes and files, so it is lighter and starts faster. The cost is that the isolation is weaker than a full virtual machine's, and you now have images to build, store, scan and update.` },
      { type: 'version', text: `Docker's documentation defines a container as an isolated process with all the files it needs to run, and contrasts it with a virtual machine, which includes an entire operating system with its own kernel. Containers share the host's kernel, and the two are often combined, for example a virtual machine hosting a container runtime. Image formats and tools change, so check the current documentation of the tool you use.`, checked: CHECKED, sources: [DOCS.docker] },
      {
        type: 'code',
        language: 'dockerfile',
        label: 'An illustrative fragment of an image recipe (pseudocode in the angle brackets, not a file to copy as is)',
        code: `FROM <a Node.js base image pinned to an exact version>
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
CMD ["node", "server.js"]`,
      },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: a container is a lunchbox for your program. Inside are the program and every ingredient it needs, so it tastes the same on any table. Infrastructure as Code is the written recipe for the kitchen itself: how many ovens, which doors are locked. If the kitchen burns down, you follow the recipe and build the same kitchen again. An orchestrator is the kitchen manager who makes sure enough lunchboxes are always being cooked and replaces any that fail. The code above says: start from a base, copy in the app, install its libraries exactly as listed, then run the server.` },
      { type: 'paragraph', text: `**Where to run it.** You do not have to jump to the biggest tool. There is a ladder, and the right rung is the lowest one that meets the requirements:` },
      {
        type: 'table',
        headers: ['Option', 'What you manage', 'Fits when', 'What it costs you'],
        rows: [
          ['Virtual machines', 'The operating system, patches, the app, scaling', 'One or two servers, a simple app, a team that knows servers well', 'Patching and manual scaling; servers slowly become unique'],
          ['A managed container service', 'The image and its size and count; the provider runs the machines', 'A few services, a small team, you want replacement and rollout handled', 'Less control; learning the provider\'s way of describing services'],
          ['Serverless functions', 'Only the function code; the platform runs it per call', 'Spiky, short, stateless work such as reacting to an upload', 'Cold starts (a delay when a function has not run recently), limits on run time and size, harder local debugging, state must live elsewhere'],
          ['An orchestrator such as Kubernetes', 'Cluster setup, upgrades, networking, security rules, plus everything above', 'Many services or teams that need one common way to run, scale and release them', 'A lot of operations skill and moving parts; a small team can spend more time on the platform than on the product'],
        ],
        caption: 'A ladder of options. Cloud providers publish limits for functions and managed services; they differ and change, so read the current limits on the provider\'s page when you design near them.',
      },
      { type: 'paragraph', text: `**Orchestration.** An orchestrator keeps a desired state: "run three copies of this image, and if one dies, start another". It also rolls out a new version gradually, connects the copies so they can find each other, and hands them settings and secrets. Kubernetes is the best-known one. It is a strong tool for the problem it solves, which is running many containers across many machines for many teams. It is not a database, a logging system or a deployment pipeline, so you still have to choose those. For TindaTrack, two services and a team of two do not have that problem, so the honest answer is no. Write down the triggers that would change your mind, such as "more than a handful of services", "several teams releasing separately" or "a need to schedule work across many machines".` },
      { type: 'version', text: `The Kubernetes documentation describes Kubernetes as a portable, extensible, open source platform for managing containerized workloads and services, with service discovery and load balancing, automated rollouts and rollbacks, self-healing, secret and configuration management and horizontal scaling. It also says Kubernetes does not provide application-level services such as databases or caches as built-in services, and does not dictate logging, monitoring or alerting. Its features and defaults change between releases, so read the page for the version you run.`, checked: CHECKED, sources: [DOCS.kubernetes] },
      { type: 'paragraph', text: `**Infrastructure as Code.** Instead of clicking resources into a console, you describe the servers, networks and databases in text files. A tool reads the files, compares them with what exists and makes reality match. Terraform, OpenTofu, Pulumi and each provider's own template format are examples. The gains are the same ones you get from source code: a history of who changed what and why, review before change, and the ability to build the same environment twice. Three ideas matter:` },
      { type: 'list', items: [
        '**Desired state and the plan.** Before changing anything, the tool shows a plan: what it will create, change or destroy. Reading the plan is the review step. A line that says a database will be replaced is the line to stop on.',
        '**State.** The tool keeps a record of what it created, so it knows what to compare. That record is critical and often contains sensitive values. Store it somewhere shared, backed up and locked while a change runs, never loose on one laptop.',
        '**Drift.** Drift is when real infrastructure no longer matches the files, usually because someone edited it by hand. Mika\'s firewall edit was drift. The next apply either reverts it or hides it, and either way the file is no longer the truth.',
      ] },
      {
        type: 'code',
        language: 'yaml',
        label: 'A made-up desired-state file (not the format of any one tool)',
        code: `network:
  name: tindatrack-prod
  zones: [zone-a, zone-b]
database:
  engine: postgresql
  standby_in_zone: zone-b
  backups_kept_days: 14
app_servers:
  count: 2
  image: registry.example.com/tindatrack/api:1.8.2
  secrets_from: secret-store`,
      },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart LR
  A[Edit the desired state file] --> B[Pull request review]
  B --> C[Plan shows the changes]
  C --> D{Human checks for deletes}
  D -->|approved| E[Apply]
  E --> F[(Real cloud resources)]
  F -.->|hand edits cause drift| A`,
        caption: 'The review path for infrastructure. Look at the decision node: a person reads the plan before apply, and the dotted arrow shows how a hand edit in the console quietly breaks the loop.',
      },
      { type: 'paragraph', text: `**The 12-Factor App.** This is a public set of twelve rules for building apps that run well as services on cloud platforms. Do not memorise it. Use it as a checklist: each factor protects against a specific pain, and a few look different with containers or serverless.` },
      {
        type: 'table',
        headers: ['Factor', 'What it protects against', 'With containers or serverless'],
        rows: [
          ['1 Codebase: one repository per app, many deploys', 'Copies of the app drifting apart', 'Still fully relevant'],
          ['2 Dependencies: declared and isolated', '"Works on my machine"', 'An image makes isolation easy'],
          ['3 Config: kept in the environment, not in code', 'Secrets in the repository; rebuilding to change a setting', 'Relevant; use a secret store for secrets, not plain variables'],
          ['4 Backing services: databases and queues are attached by address', 'Code that cannot move to a new database host', 'Relevant'],
          ['5 Build, release, run: separate stages', 'Editing code on a live server', 'Images and pipelines are exactly this'],
          ['6 Processes: stateless, share nothing', 'Lost sessions when a server is replaced', 'Essential for scaling out and for functions'],
          ['7 Port binding: the app serves by itself', 'Tying the app to one outside web server', 'Containers do this; with functions the platform handles it'],
          ['8 Concurrency: scale by running more processes', 'One giant process as the only way to grow', 'Platforms add copies for you'],
          ['9 Disposability: fast start, clean stop', 'Lost work during deploys and crashes', 'More important when platforms stop and restart often'],
          ['10 Dev and prod parity', 'Bugs that exist only in production', 'Containers help; keep the same kind of database in development'],
          ['11 Logs: write events to standard output', 'Logs lost with a replaced server', 'The platform collects them'],
          ['12 Admin tasks: one-off jobs run from the same code', 'Hand-run scripts nobody can repeat', 'Run as a one-off job from the same image'],
        ],
        caption: 'The twelve factors read as pains avoided. Factors 3, 6 and 9 are the ones a first container deployment most often breaks.',
      },
      { type: 'paragraph', text: `For TindaTrack the simplest design that meets the requirements is: the app built into an image by a pipeline, run on two virtual machines or a managed container service, infrastructure described in files for the network, database and servers, secrets in a secret store, no Kubernetes. It costs one new habit (build images, review plans) and removes the mystery.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In a large or existing system, the risks move. Images become a supply chain: pin base image versions, scan for known vulnerabilities, keep images small, and rebuild on a schedule, because a stale image is a stale dependency. For Infrastructure as Code, the blast radius is the unit of safety: split state by environment and by system so one bad apply cannot touch everything, lock the state, and treat any plan that replaces a stateful resource as a separate, rehearsed operation. An orchestrator adds its own failure modes: control plane problems, resource limits that kill a container for using too much memory, health checks that restart a slow-but-working app, and network rules that block traffic you forgot to allow. Retrofitting twelve-factor habits onto a legacy app is usually done one factor at a time, starting with config and logs.` },
      { type: 'heading', text: 'AI in Action' },
      { type: 'demo', title: 'A container recipe with two quiet problems and a platform nobody needs', prompt: `TindaTrack has two services: a Node.js API and a small worker that sends text reminders. A team of two. Write a Dockerfile for the API and tell me how to deploy both. The API reads its database password and e-wallet key from a file called .env.`, output: `FROM node:latest\nWORKDIR /app\nCOPY . .\nCOPY .env .env\nRUN npm install\nCMD ["node", "server.js"]\n\nFor deployment, I recommend a three-node Kubernetes cluster with an ingress controller, Helm charts for each service, a horizontal pod autoscaler and a service mesh. Push the image to your registry and apply the manifests.`, notice: `Three things to catch. First, "COPY .env .env" bakes the database password and payment key into the image, so everyone who can pull the image can read them (the config factor says settings and secrets live outside the image). Second, "node:latest" is not repeatable: next month's build may use a different runtime. Third, a cluster, Helm charts and a service mesh for two services and two developers answers a problem nobody described. Ask for the config to come from the environment, an exact version, and the simplest place to run two containers.` },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Write down how you run your system today, and one thing that hurts. Decide where on the ladder you would put it. Then ask an assistant to review your reasoning against the twelve factors.` },
      { type: 'prompt', label: 'Runtime and packaging review', text: `My system: [services, languages, team size, how it is deployed today].\nOne recurring problem: [for example "setup differs between machines" or "nobody knows what is in production"].\nMy decision: [where I would run it: virtual machines, a managed container service, functions or an orchestrator, and why].\nMy requirements: [downtime I accept, release frequency, who is on call].\n\nAct as a sceptical reviewer. 1) Check my setup against each of the twelve factors and list which ones it breaks, with the line or habit that breaks it. 2) Tell me whether the next rung down the ladder would meet my stated requirements, and what I would lose. 3) List what my decision would cost in skills, operations and failure modes. 4) Name any requirement you assumed that I did not write. 5) Say what you cannot judge without seeing my real files. Do not choose for me.` },
      { type: 'paragraph', text: `Verify the factor-by-factor list against your real files, not against the assistant's confidence. If it recommends an orchestrator, ask which sentence of your requirements needs one. If you paste a file, remove real secrets first.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Write a recipe for one of your own services and check it for baked-in secrets and unpinned versions.',
        'Move one hand-made piece of infrastructure into a file and practise reading the plan before applying it.',
        'Read the container and orchestration pages in the version notes above for the tools you actually use.',
        'Next, lesson 26 looks at managed services, CDNs, load balancers and cloud cost.',
      ] },
      { type: 'takeaways', items: [
        'A container packages the app and its dependencies, shares the host kernel and starts fast; a virtual machine carries a whole operating system.',
        'Choose the lowest rung of the ladder (virtual machines, a managed container service, functions, an orchestrator) that meets the written requirements, and write down the triggers that would move you up.',
        'Infrastructure as Code gives history, review and rebuilds. Read the plan, protect the state, and treat hand edits as drift.',
        'The twelve factors are a checklist of pains avoided. Config, stateless processes and disposability are the ones a first container deployment most often breaks.',
        'An orchestrator costs operations skill, so a team of two with two services usually does not need one.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-25-workflow-builder-1',
          kind: 'workflow-builder',
          title: 'Review an infrastructure change safely',
          prompt: 'Build the routine Mika\'s team should follow to change a firewall rule in production. Pick the steps and put them in order. Some are tempting and wrong.',
          concept: 'reviewing infrastructure changes',
          situation: 'TindaTrack\'s infrastructure is now described in files. A developer needs to let the new worker reach the database. The change touches production, where a wrong rule can cut the app off from its data. The team wants a routine that catches mistakes before they reach production and keeps people responsible for the decision.',
          parts: [
            { id: 'edit', lane: 'input', label: 'Change the desired-state file', detail: 'The new rule is written in the file in the repository.' },
            { id: 'console', lane: 'tool', label: 'Also click the same change into the live console to be fast', detail: 'The live system is changed by hand while the file is being reviewed.' },
            { id: 'plan', lane: 'tool', label: 'Run the plan to preview what would change', detail: 'The tool lists what it would create, change or destroy, without doing it.' },
            { id: 'ai-summary', lane: 'ai', label: 'Ask an assistant to summarise the plan in plain words and flag risky lines', detail: 'The assistant gives a quick summary to help the reader know where to look.' },
            { id: 'trust-ai', lane: 'ai', label: 'Approve because the assistant said the plan is safe', detail: 'The assistant\'s summary replaces reading the plan.' },
            { id: 'read-plan', lane: 'human', label: 'Read the actual plan and check for deletes and replaced databases', detail: 'A person reads the real plan lines, not only the summary.' },
            { id: 'review', lane: 'human', label: 'A second person reviews the change and the plan', detail: 'A colleague approves the pull request after reading the plan.' },
            { id: 'delete-state', lane: 'tool', label: 'Delete the state record so the plan looks quieter', detail: 'The tool forgets what it created and plans to create everything again.' },
            { id: 'apply', lane: 'tool', label: 'Apply the reviewed plan', detail: 'The tool makes the real infrastructure match the file.' },
            { id: 'verify', lane: 'output', label: 'Check the app still works and a new plan shows no further changes', detail: 'A clean plan after apply shows no drift, and a quick test shows the app reaches its data.' },
          ],
          rules: [
            { id: 'r-require', kind: 'require', parts: ['edit', 'plan', 'read-plan', 'review', 'apply', 'verify'], message: 'The routine needs a file change, a plan, a person reading the plan, a second review, an apply and a check afterwards.' },
            { id: 'r-no-console', kind: 'forbid', parts: ['console'], message: 'A hand edit in the console is drift. The file and the real system no longer agree, and the next apply can undo it.' },
            { id: 'r-no-trust', kind: 'forbid', parts: ['trust-ai'], message: 'An assistant\'s summary can miss or misstate a line. A person who is accountable reads the real plan.' },
            { id: 'r-no-delete-state', kind: 'forbid', parts: ['delete-state'], message: 'Without its state record the tool no longer knows what exists, which can duplicate or destroy resources.' },
            { id: 'r-edit-plan', kind: 'before', parts: ['edit', 'plan'], message: 'The plan previews the change, so the change must be written first.' },
            { id: 'r-plan-read', kind: 'before', parts: ['plan', 'read-plan'], message: 'You can only read a plan that exists.' },
            { id: 'r-read-review', kind: 'before', parts: ['read-plan', 'review'], message: 'The author reads the plan first so the reviewer gets a change the author understands.' },
            { id: 'r-review-apply', kind: 'before', parts: ['review', 'apply'], message: 'Nothing is applied to production before the second person has approved it.' },
            { id: 'r-apply-verify', kind: 'before', parts: ['apply', 'verify'], message: 'The check afterwards can only follow the change.' },
          ],
          solution: ['edit', 'plan', 'ai-summary', 'read-plan', 'review', 'apply', 'verify'],
          minSteps: 6,
          maxSteps: 8,
          simulation: {
            input: 'Allow the worker service to reach the database on its port.',
            steps: {
              edit: 'The developer adds one rule to the network section of the file.',
              plan: 'The plan shows one rule added and nothing else changed.',
              'ai-summary': 'The assistant summarises: one rule added for the worker. It flags nothing risky, and says it has not seen the rest of the repository.',
              'read-plan': 'The developer reads the plan lines and confirms no database is replaced and no existing rule is removed.',
              review: 'A colleague reads the same plan and approves the pull request.',
              apply: 'The tool adds the rule to production.',
              verify: 'The worker connects, and a new plan shows no changes.',
            },
            output: 'One firewall rule added, reviewed by two people, with no drift and a worker that reaches its data.',
          },
          hints: [
            'Which steps remove a person from the decision, or make the file and the real system disagree?',
            'The plan has to exist before anyone can read it, and the review comes before the apply.',
            'The assistant may summarise the plan, but a person reads the real one. Leave out the console edit, the state deletion and the blind approval.',
          ],
          explanation: 'A safe change is written in the file, previewed as a plan, read by the person who made it and reviewed by a second, then applied and checked. An assistant can help you read, but the people stay accountable. The wrong steps create drift, hide the system from its own tool, or hand the decision to a summary.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-25-match-1',
          kind: 'match',
          title: 'Which factor was broken?',
          prompt: 'Match each problem to the twelve-factor rule it breaks.',
          concept: '12-Factor App',
          labels: { terms: 'The problem', meanings: 'The rule that was broken' },
          pairs: [
            { term: 'The database password was committed to the repository and baked into the image.', definition: 'Config belongs in the environment, not in code', note: 'This is a config problem: settings and secrets should be supplied when the app starts, not stored in the code or the image.' },
            { term: 'A replaced server lost the shopping sessions it kept in its own memory.', definition: 'Processes are stateless and share nothing', note: 'State kept inside one process disappears when the process or server is replaced.' },
            { term: 'Logs are written to a file on a server that is rebuilt on every deploy.', definition: 'Logs are treated as an event stream', note: 'Writing events to standard output lets the platform collect them, so a rebuilt server loses nothing.' },
            { term: 'A deploy interrupts requests that were halfway through, and some sales are lost.', definition: 'Disposability: fast start and a clean stop', note: 'The app should finish or hand back work when told to stop, because platforms stop and restart processes often.' },
          ],
          hints: [
            'Ask where the thing lives: in the code, in a process\'s memory, in a file on a server, or in the middle of a request.',
            'Two problems are about something being lost when a server is replaced. One is about something exposed.',
            'Match by what is lost or leaked, not by the technology.',
          ],
          explanation: 'Each factor names a pain. Reading a failure as a broken factor tells you the fix: move the setting out, move the state out, send events out, or stop cleanly.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-25-scenario-1',
          kind: 'scenario',
          title: 'Do we need Kubernetes?',
          prompt: 'Choose the best advice for the team.',
          concept: 'orchestration trade-offs',
          situation: 'A new developer proposes Kubernetes for TindaTrack. There are two services (an API and a worker), two developers, a requirement that allows an hour of downtime in a rare incident, and a release about once a week. Nobody on the team has run a cluster before.',
          options: [
            { text: 'Run two containers on a managed container service, describe the infrastructure in files, and write down the triggers (more services, more teams, scheduling needs) that would justify an orchestrator.', consequence: 'Replacement and rollouts are handled with little to learn. The team keeps its time for the product and has a clear, agreed point at which to revisit.', quality: 'best' },
            { text: 'Run the two containers on two virtual machines with a script, and revisit the choice if the team grows.', consequence: 'It meets the requirements and is simple, though the team has to patch the machines and write the replacement logic itself. A reasonable, slightly more manual path.', quality: 'acceptable' },
            { text: 'Adopt Kubernetes now so the team will not have to migrate later.', consequence: 'Two developers spend weeks on cluster setup, upgrades and network rules. Releases slow down, and the extra power is never used.', quality: 'poor' },
            { text: 'Adopt Kubernetes because an assistant said it is the industry standard for modern apps.', consequence: 'The decision is not tied to any requirement, so nobody can explain what it buys. The team inherits operations work with no benefit they can point to.', quality: 'poor' },
          ],
          hints: [
            'What problem does an orchestrator solve, and does a two-service team have it?',
            'Look for the option that is tied to the written requirements and names when to revisit.',
            'Migrating later is real, but weeks of unneeded platform work now is a certain cost.',
          ],
          explanation: 'An orchestrator pays off when many services or teams need one common way to run and scale software. A small system gets most of the benefit from a managed container service. The trigger list turns "maybe later" into a decision you can check.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-25-q1',
        prompt: 'A teammate says, "Containers are just small virtual machines." What is the most accurate correction?',
        choices: [
          'A container shares the host\'s kernel and isolates only the app\'s processes and files, so it starts faster than a virtual machine but isolates less strongly.',
          'A container includes its own full operating system and kernel, so it is heavier than a virtual machine but easier to move between providers.',
          'A container is a virtual machine that the provider manages for you, so the two names mean the same thing on every platform and the host\'s kernel is never shared with any other container.',
          'A container runs only on the developer\'s own laptop and must be converted into a virtual machine before it can be used in the cloud.',
        ],
        answer: 0,
        explanation: 'The kernel-sharing difference is what makes containers lighter and faster to start, and also why isolation is weaker than a full virtual machine\'s.',
      },
      {
        id: 'software-architecture-ai-25-q2',
        prompt: 'The plan for an infrastructure change says "database: must be replaced". The author says the assistant summarised the plan as "safe". What should happen?',
        choices: [
          'Apply it, because an assistant that read the whole plan is more reliable than a person reading it quickly at the end of a long day.',
          'Apply it to a copy of production first, but only skip the human review when the same assistant checks that copy as well.',
          'Delete the state record so that the replacement line disappears from the plan, then apply the cleaned plan as usual.',
          'Stop, read the real plan, and treat the replacement of a stateful resource as a separate, rehearsed operation with a tested backup.',
        ],
        answer: 3,
        explanation: 'A replaced database can mean lost data. An assistant\'s summary helps you look, but a person reads the plan and carries the decision.',
      },
      {
        id: 'software-architecture-ai-25-q3',
        prompt: 'An app writes uploaded files and user sessions to the local disk of one server. Which twelve-factor problem will appear first when the team adds a second server?',
        choices: [
          'Port binding, since two servers cannot answer on the same port and one of them will refuse requests.',
          'Processes should be stateless: a request that lands on the other server cannot find the session or the file.',
          'Dev and prod parity, since the second server will have a different version of the programming language installed.',
          'Admin tasks, because one-off scripts can no longer run on a server that is serving traffic at the same time.',
        ],
        answer: 1,
        explanation: 'State held inside one process or server breaks as soon as a request can reach another copy. Moving sessions and files to shared services fixes it.',
      },
      {
        id: 'software-architecture-ai-25-q4',
        prompt: 'Which statement best describes the cost of choosing Kubernetes for a team of two with two services?',
        choices: [
          'It costs nothing extra, because the platform handles databases, logging and deployments for the team.',
          'It costs little, as long as every service is moved into serverless functions before the cluster is created, because functions remove every cluster chore at once.',
          'It costs operations skill and time for cluster setup, upgrades and network and security rules, and it still leaves databases, logging and pipelines to be chosen.',
          'It costs only money, because the cluster is simple to run once it is created and needs no ongoing work.',
        ],
        answer: 2,
        explanation: 'An orchestrator runs containers; it does not replace the other choices. The ongoing operations work is the hidden cost for a small team.',
      },
      {
        id: 'software-architecture-ai-25-q5',
        audience: { max: 'beginner' },
        prompt: 'In the kitchen comparison, what does Infrastructure as Code stand for?',
        choices: [
          'A written recipe for the whole kitchen, so it can be built again the same way.',
          'A lunchbox that holds the program and its ingredients.',
          'The kitchen manager who replaces lunchboxes that fail.',
        ],
        answer: 0,
        explanation: 'Infrastructure as Code is the recipe for the kitchen. The lunchbox is the container and the kitchen manager is the orchestrator.',
      },
      {
        id: 'software-architecture-ai-25-q6',
        audience: { min: 'advanced' },
        prompt: 'A team keeps all environments in one Infrastructure as Code state and applies changes from a laptop. What is the most important change to make first?',
        choices: [
          'Merge the state files so there is only one place to look, which makes drift easier to see.',
          'Split state by environment and system, store it remotely with locking, and apply changes through a reviewed pipeline.',
          'Stop writing plans, since they delay changes and the apply output already shows what was done.',
          'Move every resource out of the files and back into the console so that one tool shows the truth for the whole team in one place.',
        ],
        answer: 1,
        explanation: 'The blast radius of a bad apply and the safety of the state record are the key risks. Splitting, locking and a reviewed pipeline reduce both.',
      },
    ],
    task: {
      title: 'Check a service against the twelve factors',
      minutes: 18,
      steps: [
        'Choose one service you run or have built. Write down where its config, secrets, sessions, uploaded files and logs live today.',
        'Go through the twelve-factor table and mark each factor kept, partly kept or broken, with one line of evidence.',
        'Pick the one broken factor that would hurt most when a second copy runs, and write the smallest change that fixes it.',
        'Write where you would run it on the ladder, one line on why, and the triggers that would move you up a rung.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Pick a small app you built. Find one setting or password inside the code and write where it should live instead (the environment or a secret store).'] },
      { audience: { min: 'advanced' }, steps: ['For your real system, write the blast radius of your worst possible infrastructure apply today (what could one bad change touch?), and one change that would shrink it.'] },
    ],
  },
  {
    id: 'software-architecture-ai-26',
    day: 26,
    title: 'Managed Services, CDN, Load Balancing and Cloud Cost',
    summary: 'Decide what to buy and what to run, place a CDN and a load balancer where they help, and treat cost as a design input you can measure.',
    intro: {
      objectives: [
        'Choose between a managed service and running something yourself, with reasons beyond price',
        'Explain what a CDN and a load balancer do, and what must never be cached or checked carelessly',
        'Name the main drivers of cloud cost and the design levers that lower them',
        'Write cost as a measurable requirement instead of a surprise on the bill',
      ],
      why: 'Cloud bills and weekend pages both come from decisions made early: what you run yourself, what you serve from where, and what nobody was watching. An architect who plans for cost and operations avoids both.',
    },
    minutes: 26,
    skills: ['arch-cloud'],
    body: [
      { type: 'paragraph', text: `Every block in a design has an owner. Either your team operates it, or a provider operates it for you as a **managed service** and you configure and pay for it. At the edge of the design sit two more blocks, a CDN and a load balancer, that decide how requests reach you. And across the whole design runs a quality that is easy to forget until the bill arrives: cost. This lesson is about making those three choices on purpose, with no prices, because prices change and the reasoning does not.` },
      { type: 'heading', text: 'A real situation' },
      { type: 'paragraph', text: `Early in its life, TindaTrack ran its own PostgreSQL on a virtual machine "for flexibility". One Friday, Mika and Ben spent the whole day on a database version upgrade and a full disk, and the reminders feature they had promised store owners slipped by a week. A few months later, with a managed database in place and a growing team, a different problem appeared. The monthly cloud bill was much larger than anyone expected. Three test environments had been left running over a long holiday, old report exports had never been deleted, and every phone downloaded the same product images straight from the app servers each time.` },
      { type: 'paragraph', text: `Nobody had done anything reckless. Nobody owned cost, so nobody looked. The first problem was operating too much of what the team did not need to own. The second was operating nothing about cost. Both are architecture decisions.` },
      { type: 'heading', text: 'How it works' },
      { type: 'paragraph', text: `**Buy or run.** A managed service takes over work such as patching, backups, failover options and scaling. Think of a hotel and a house. A hotel does the cleaning and repairs for you, and charges for it. A house gives you full control and every chore. Neither is better. The question is whether the chore is worth your team's time. Ask these questions about each block:` },
      { type: 'list', items: [
        '**Does it make our product different?** Your sales and stock rules do. A database engine, object storage, text-message delivery and an e-wallet provider do not. Buy what is not your edge.',
        '**Can our team operate it safely?** Running a database well means backups you have tested, upgrades, tuning and being on call. Two developers may not have the time.',
        '**Do we need control the managed version does not allow?** Managed services have rules, limits and supported versions. Read them against your needs before you commit.',
        '**What is the exit cost?** If you had to leave, what would it take? A managed service built on an open standard (such as PostgreSQL) is much easier to leave than one with a private interface. Lock-in is a cost to estimate, not a reason to refuse every managed service.',
        '**What does it cost in total?** A managed service often looks dearer per unit but saves people time and incidents. Running it yourself looks cheap until you count the hours.',
      ] },
      { type: 'paragraph', text: `One warning: managed does not mean unattended. You still design the schema, set access rules, choose backup retention, test a restore, and watch usage. The provider runs the engine. You still run the system.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `flowchart TD
  A[A new building block is needed] --> B{Does it make our product different}
  B -->|yes| C[Build it and run it ourselves]
  B -->|no| D{Can our team operate it safely}
  D -->|no| E[Buy a managed service]
  D -->|yes| F{Does the managed version fit our limits}
  F -->|yes| E
  F -->|no| G[Run it and budget the people time]`,
        caption: 'A buy-or-run decision as questions. Follow the "no" branches: most blocks that are not your edge and that your team cannot operate safely end at a managed service.',
      },
      { type: 'visual', id: 'arch-tradeoff-matrix', caption: 'Score "managed database" against "self-run database on a virtual machine" using criteria from your own requirements, such as operations effort, control, exit cost and total cost. Weight them before you score.' },
      { type: 'paragraph', audience: { max: 'beginner' }, text: `In plain words: a managed service is like staying in a hotel instead of owning a house. Someone else fixes the plumbing, and you pay for that. A CDN is like a shop that opens small branches near customers, so people do not travel to the main shop for common items. A load balancer is the person at the door who sends each visitor to a counter that is open. Cost is the electricity meter: it only stays low if someone reads it, and it grows when lights are left on in empty rooms.` },
      { type: 'paragraph', text: `**CDN (content delivery network).** A CDN keeps copies of your files at many locations near users. The first request goes through to your origin (for example your object storage), the CDN keeps a copy, and later requests are answered from the nearby copy. It makes pages load faster, takes load off your servers and often lowers the amount of data leaving your cloud. Use it for files that are the same for everyone: scripts, styles, public images. Two cautions. Copies can go stale, so give changing files new names (a version in the file name) or a short lifetime. And never cache private data in a shared edge: a report with one store's sales must not be served to another store. For TindaTrack, the web app's static files and public product images belong on a CDN; API responses with tenant data do not.` },
      {
        type: 'diagram',
        format: 'mermaid',
        source: `sequenceDiagram
  participant P as Owner phone
  participant C as CDN edge
  participant O as Origin storage
  P->>C: First request for the logo
  C->>O: Not cached so fetch the file
  O-->>C: File and how long to keep it
  C-->>P: File
  P->>C: Second request for the logo
  C-->>P: Served from the edge copy`,
        caption: 'A CDN cache miss and then a hit. Look at the second request: it never reaches the origin, which is where the saving in load and in data leaving the cloud comes from.',
      },
      { type: 'paragraph', text: `**Load balancer.** A load balancer is the public front door for several servers. It spreads requests across the ones that are healthy, and it finds out which are healthy by calling a health check address on each. It can also end the secure connection (TLS) for you and route by path. Lesson 27 covers how it spreads work and why your app must be stateless for that to work. The part to design now is the health check. A health check that also tests the database looks safe, but when the database is slow for a minute, every server fails the check, the load balancer removes them all, and a small database problem becomes a total outage. Keep the check shallow: "can this process serve requests?"` },
      {
        type: 'code',
        language: 'typescript',
        label: 'A shallow health check (fragment: the app object is assumed)',
        code: `// The load balancer calls this on every server.
// It answers "can this process serve?" and does not call the database.
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});`,
      },
      { type: 'paragraph', text: `**Cost as a design input.** Cloud cost has a handful of drivers, and they are the same on every provider: how long compute runs (including idle environments), how much storage you keep and for how long, how much data leaves the provider's network (usually billed), how many requests or operations you make, the size and tier of managed services, and how much logging and monitoring data you store. People time is the last driver and often the largest. A cost-aware design works like this:` },
      { type: 'list', ordered: true, items: [
        'Make cost visible. Label every resource by environment, team and feature, and look at the bill grouped by label.',
        'Set a budget and an alert, so a surprise reaches a person in days, not at month end. An alert tells you, it does not stop spending.',
        'Look at the top two or three drivers each month, not every line.',
        'Pull a design lever on the top driver: turn off test environments when idle, delete data on a retention rule, serve public files from a CDN, right-size what is oversized.',
        'Write cost as a measurable requirement, such as "cost per active store stays under a target we set", so growth and cost are compared, not guessed at.',
      ] },
      { type: 'paragraph', text: `Many providers offer lower rates if you commit to steady usage for a period. Treat that as a late step. Commit only for load you have measured to be steady, and read the terms, because a commitment is a bet that your design will not change. For a SaaS like TindaTrack, cost per tenant is also a business input: if one big tenant costs far more than it pays, the architecture or the plan needs to change.` },
      { type: 'paragraph', audience: { min: 'advanced' }, text: `In a large or existing system, exit cost deserves a real estimate: list the managed services you use, the proprietary interfaces among them, and the data you would have to move, then decide where the lock-in is worth its benefit. Managed services also bring limits that shape the design, such as a ceiling on database connections, supported versions and maintenance windows you do not control, so check them against your peak behaviour before you depend on them. Cost anomalies are usually a design smell: a runaway retry loop, a chatty cross-zone call or unbounded log volume. Budgets and alerts are detective controls only, so add quotas or guardrails where a mistake could spend without limit. Unit economics (cost per tenant, per request, per order) is the measure that lets product and engineering argue from the same number.` },
      { type: 'heading', text: 'AI in Action' },
      { type: 'demo', title: 'A cost-cutting plan with a number nobody can source', prompt: `TindaTrack's cloud bill is higher than we expected. We use a managed PostgreSQL database, object storage for receipt photos, two app servers, three test environments and a CDN for static files. Load varies a lot from day to day. Suggest how to cut our cloud cost.`, output: `This plan will cut your bill by about 40%. 1) Buy three-year commitments for all compute and the database, which gives the deepest discount. 2) Switch to the cheapest provider. 3) Drop the managed database and run PostgreSQL yourself on a small server. 4) Turn off automatic backups, since they add storage cost. 5) Delete the CDN, because it is an extra bill.`, notice: `Check the figure first: "about 40%" has no source and no basis in the facts you gave. Then check the advice against your requirements. A three-year commitment for load that "varies a lot" bets on a steady load you have not measured. Moving providers has a cost the answer ignores. Removing the managed database and the backups trades a visible saving for operations work and a risk of losing data. Removing the CDN may raise the data bill. A better reply starts with the bill grouped by label, finds the top driver, and proposes one lever at a time.` },
      { type: 'heading', text: 'Try it with AI' },
      { type: 'paragraph', text: `Write your own buy-or-run decision and your cost guess first. Then ask an assistant to test them against what you told it, and to say what it cannot know without your bill.` },
      { type: 'prompt', label: 'Buy-or-run and cost review', text: `My system: [short description, team size, what it stores].\nMy blocks and my decision for each: [for example "database: managed, because...", "queue: self-run, because..."].\nWhat I think my top cost drivers are: [your guess, in order].\nMy requirements: [availability, data location rules, growth expectation].\n\nAct as a sceptical reviewer. 1) For each block, tell me whether my reason is a requirement, a habit or a guess. 2) Name the exit cost of each managed service I chose. 3) Challenge my guess about cost drivers and say what data (such as the bill grouped by label) would confirm or reject it. 4) Suggest cost levers one at a time, each with what it risks. 5) Do not give a percentage or a saving unless you can show how you got it, and say what you cannot know. Do not choose for me.` },
      { type: 'paragraph', text: `Read the answer for any number it cannot support, and for any saving that quietly removes a backup, a safeguard or a requirement. Confirm the drivers against your own bill grouped by label, not against the assistant's guess.` },
      { type: 'heading', text: 'Next steps' },
      { type: 'list', items: [
        'Take one block of your system and run the buy-or-run questions on it, writing a one-line reason for each.',
        'Label your resources by environment and look at your bill (or a sample) grouped by label this week.',
        'Check which of your public files could sit behind a CDN, and which responses must never be cached in a shared place.',
        'Now start Project 1: it asks you to design a multi-tenant SaaS and draws on modules 1 to 7.',
      ] },
      { type: 'takeaways', items: [
        'Buy what is not your edge and what your team cannot operate safely. Managed does not mean unattended: you still test restores and watch usage.',
        'Estimate exit cost before you depend on a managed service. A standard interface makes leaving cheaper.',
        'A CDN serves shared files from a nearby copy. Never cache private tenant data in a shared edge, and version files that change.',
        'Keep load balancer health checks shallow, so a slow database does not remove every server at once.',
        'Make cost visible with labels, set a budget and an alert, pull one lever on the top driver, and write cost as a measurable requirement. Never trust a saving figure without a basis.',
      ] },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-26-scenario-1',
          kind: 'scenario',
          title: 'The surprising bill',
          prompt: 'Choose what the team should do first.',
          concept: 'cost as a design input',
          situation: 'TindaTrack\'s cloud bill is much larger than expected this month. Nobody knows why. There are three test environments, a managed database, object storage and two app servers. A developer suggests switching providers. Another suggests deleting old logs. A third wants to cap spending automatically.',
          options: [
            { text: 'Group the bill by environment and feature label, find the top two drivers, and change one thing at a time.', consequence: 'The team finds three idle test environments and an unbounded export folder. Turning environments off at night and adding a retention rule cuts the bill without touching production.', quality: 'best' },
            { text: 'Set a budget alert at a sensible level and review the bill again in a month before changing anything.', consequence: 'The alert will warn the team sooner next time, but this month\'s drivers stay unknown and the waste continues for another month.', quality: 'acceptable' },
            { text: 'Switch to a cheaper provider immediately.', consequence: 'Weeks of migration work, new risks and no knowledge of why the old bill was high. The same idle environments reappear on the new provider.', quality: 'poor' },
            { text: 'Delete the oldest logs, backups and photos to shrink storage.', consequence: 'Storage drops a little, but the real drivers are untouched, and the team has weakened its ability to investigate incidents and restore data.', quality: 'poor' },
          ],
          hints: [
            'You cannot choose a lever until you know which driver is biggest. What would show you that?',
            'Look for the option that finds the cause before it changes anything.',
            'Removing safeguards to save money is rarely the cheapest fix in the end.',
          ],
          explanation: 'Visibility comes first: label, group, find the top drivers, then pull one lever. An alert helps the future but does not explain the past, and switching provider or deleting safeguards acts without evidence.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-26-arrange-1',
          kind: 'arrange',
          title: 'Run a cost review in order',
          prompt: 'Put the steps of a monthly cost review in a sensible order.',
          concept: 'cost review',
          language: 'text',
          solution: [
            'Group last month\'s bill by environment, team and feature label',
            'Pick the top two or three cost drivers',
            'Choose one design lever for the biggest driver, with its risk',
            'Make that one change in a single environment first',
            'Compare the next bill with the previous one for that driver',
            'Write down what changed and update the cost target',
          ],
          reasons: [
            'You cannot read a bill that has no labels, so grouping comes first.',
            'Looking at every line wastes effort, so focus on the few that matter.',
            'A lever needs its risk written next to it, so a saving does not remove a safeguard.',
            'One change at a time, in one place, shows what the change did.',
            'The check against the previous bill is the evidence that the lever worked.',
            'Recording the result turns one fix into a habit and a measurable target.',
          ],
          hints: [
            'What must exist before you can find the biggest driver?',
            'Change one thing, then measure. Which step is the measuring?',
            'The last step is about not repeating the surprise.',
          ],
          explanation: 'A review moves from visibility to focus to one controlled change to evidence to a recorded result. Doing the change before the evidence is a guess; skipping the record repeats the surprise.',
        },
      },
      {
        type: 'activity',
        activity: {
          id: 'software-architecture-ai-26-match-1',
          kind: 'match',
          title: 'Cache it at the edge, or not?',
          prompt: 'Match each TindaTrack response to the right CDN decision.',
          concept: 'CDN and caching boundaries',
          labels: { terms: 'The content', meanings: 'The edge decision' },
          pairs: [
            { term: 'The web app\'s script and style files, rebuilt with each release', definition: 'Cache widely for a long time, using a version in the file name', note: 'These are the same for everyone, and a new file name on each release avoids stale copies.' },
            { term: 'A store owner\'s sales report returned by the API', definition: 'Do not cache in a shared edge, because it is private to one store', note: 'A shared edge could serve one store\'s numbers to another store, which is a tenant leak.' },
            { term: 'The public TindaTrack logo and help images', definition: 'Cache widely, with a long lifetime', note: 'Public, identical for everyone and rarely changing, so a nearby copy is safe and cheap.' },
            { term: 'The price list a store changes several times a day', definition: 'Do not cache at the edge, or only for a very short time', note: 'It changes often and belongs to one store, so a stale or shared copy would show wrong prices.' },
          ],
          hints: [
            'Ask two questions: is the content the same for everyone, and how often does it change?',
            'Anything that holds one store\'s data fails the first question.',
            'A file name that changes with each release lets you cache without fear of staleness.',
          ],
          explanation: 'Edge caching suits content that is identical for everyone and changes rarely or can be renamed. Anything private to a tenant stays out of a shared edge, which is a security boundary as much as a speed choice.',
        },
      },
    ],
    quiz: [
      {
        id: 'software-architecture-ai-26-q1',
        prompt: 'A team of two wants to run its own message broker "to keep control". The system needs a queue for text reminders and nothing unusual. What is the strongest first question?',
        choices: [
          'Which broker has the most features and the longest list of supported plug-ins, because more features lower the risk of a later migration.',
          'Whether the reminder queue is part of what makes the product different, and whether two people can operate and be on call for a broker safely.',
          'Whether a managed broker is free for the first year, since cost matters more than operations.',
          'Whether the broker is written in the same language as the app, so developers can read its code.',
        ],
        answer: 1,
        explanation: 'Buy or run turns on whether the block is your edge and whether your team can operate it safely. Features, a free period and a shared language do not answer either.',
      },
      {
        id: 'software-architecture-ai-26-q2',
        prompt: 'The health check on every app server also runs a database query. The database becomes slow for a minute. What is the most likely result?',
        choices: [
          'Only the slowest server is removed, and the others carry the traffic until the database recovers.',
          'Every server fails the check and is removed, so a short database slowdown becomes a full outage.',
          'The load balancer retries the database itself and hides the slowdown from users.',
          'Nothing changes, because load balancers ignore health checks that take longer than a few seconds.',
        ],
        answer: 1,
        explanation: 'A deep health check ties every server to the same dependency, so one shared slowdown looks like every server being sick. A shallow check keeps servers in service.',
      },
      {
        id: 'software-architecture-ai-26-q3',
        prompt: 'An assistant says, "Move reports to the CDN so they load faster". The reports show each store\'s own sales. What is the right response?',
        choices: [
          'Accept, because a CDN encrypts content, so cached copies can only be read by the right store.',
          'Accept, but give the reports a very long lifetime so the edge keeps each copy as long as possible and the origin is almost never asked.',
          'Reject caching them in a shared edge, because one store\'s report could be served to another; cache inside the app with the tenant in the key.',
          'Reject it only if the reports are larger than the images already on the CDN.',
        ],
        answer: 2,
        explanation: 'Private tenant data must not sit in a shared cache keyed only by address. Caching can still help, but at a place that checks who is asking.',
      },
      {
        id: 'software-architecture-ai-26-q4',
        prompt: 'An assistant proposes a three-year commitment for all compute because it gives the deepest discount. Load varies a lot from day to day and the design may change. What is the best reply?',
        choices: [
          'Agree, since a discount that deep outweighs any change you might later make to the design.',
          'Agree for the database only, because databases never change size and a commitment on them cannot be wasted if the design changes later.',
          'Ask the assistant for the exact percentage saved and accept the plan if the figure is above ten percent.',
          'Hold off: measure the steady part of the load first, commit only for that, and read the terms before betting on an unchanged design.',
        ],
        answer: 3,
        explanation: 'A commitment is a bet that the usage will stay. Measure the steady baseline first and commit only for it. A claimed percentage is not evidence.',
      },
      {
        id: 'software-architecture-ai-26-q5',
        audience: { max: 'beginner' },
        prompt: 'In the shop comparison, what does a CDN stand for?',
        choices: [
          'A small branch of the shop near customers that keeps copies of common items.',
          'The person at the door who sends each visitor to an open counter.',
          'The electricity meter that shows how much the shop is using.',
        ],
        answer: 0,
        explanation: 'A CDN keeps copies close to users. The person at the door is the load balancer and the meter stands for cost.',
      },
      {
        id: 'software-architecture-ai-26-q6',
        audience: { min: 'advanced' },
        prompt: 'A team depends heavily on a managed database with a private interface. What is the best way to treat the lock-in?',
        choices: [
          'Avoid all managed services from now on, because any dependency is the same risk as a private interface.',
          'Ignore it, since providers rarely change their services, and exit cost only matters at the end of a project.',
          'Estimate the exit cost (what would have to move and how), and decide where the benefit is worth it and where a standard interface would be safer.',
          'Move to a second provider immediately so that every service exists twice for safety.',
        ],
        answer: 2,
        explanation: 'Lock-in is a cost to size and weigh against the benefit, not a reason to refuse everything or to double the system.',
      },
    ],
    task: {
      title: 'Buy-or-run and cost review for one system',
      minutes: 18,
      steps: [
        'List five blocks of a system you know (database, queue, storage, servers, email or SMS). For each, write whether you run it or buy it, and one reason.',
        'Mark each reason as a requirement, a habit or a guess. Rewrite the guesses as questions you could answer.',
        'List your top three cost drivers by guess. Say what data would confirm each (for example the bill grouped by label).',
        'Pick one lever for the likely top driver, and write its risk in one sentence. Do not name a saving you cannot support.',
      ],
    },
    taskExtra: [
      { audience: { max: 'beginner' }, steps: ['Think about a phone plan or a streaming subscription you pay for. Write which part you use most, which part you pay for but rarely use, and one thing you would change.'] },
      { audience: { min: 'advanced' }, steps: ['Write a unit-cost line for your real system (cost per tenant, per order or per active user) and list what data you would need to compute it. Add the one guardrail that would stop a mistake from spending without limit.'] },
    ],
  },
];

const P1 = 'software-architecture-ai-p1';

export const project: Project | null = {
  id: P1,
  title: 'Design a Multi-Tenant SaaS Architecture',
  summary: 'Design the architecture of a multi-tenant SaaS product (your own idea, or StoreDesk, a helpdesk for small shops) from requirements to diagrams, data, API, access rules, tenant isolation and decision records, using AI as a critic and never as the author.',
  outcome: 'A written architecture with measurable requirements, consistent C4 diagrams, a reasoned tenant isolation choice and decision records that you can show a team lead or an interviewer as proof that you can shape a whole system.',
  unlockAfterDay: 26,
  steps: [
    {
      id: `${P1}-s1`,
      text: `Objectives
By the end you will have designed one multi-tenant SaaS product on paper, and can show: (1) business requirements and actors; (2) technical and non-functional requirements with a number or a test for each; (3) a C4 context diagram, a container diagram and one component view that agree with each other; (4) a component design with the responsibility of each part; (5) a database schema with the tenant isolation approach chosen, compared with at least one rejected alternative; (6) an API design for two key flows; (7) authentication and authorization, with roles and the tenant boundary; (8) isolation across data, application and noisy-neighbour concerns; (9) at least three Architecture Decision Records. The product is yours: choose any SaaS idea where many separate customers (tenants) share one system, or use StoreDesk, a helpdesk where each small shop is a tenant, its staff answer customer messages as tickets, and customers can attach photos. The baseline is the simplest architecture that meets your stated requirements.`,
    },
    {
      id: `${P1}-s2`,
      text: `Tools and resources
Use the interactive tools in this course and save your work in them, because the coach also receives what you saved: the Architecture Diagram Workbench (arch-diagram-workbench) for the three C4 diagrams, the Architecture Decision Record builder (arch-adr-builder) for each ADR, the Trade-Off Matrix (arch-tradeoff-matrix) to compare your isolation options and your hosting options, and the Architecture Assistant (arch-assistant, Tali) as a critic. Lessons to reread: From Business Needs to Actors, Goals and Constraints; Quality Attributes: Making Performance, Availability, Security and Scale Measurable; Monolith and Modular Monolith: The Strong Default; Choosing a Style: A Decision Method You Can Defend; Decomposing a System: Components, Responsibilities and Bounded Contexts; Multi-Tenant Data Models and AI-Assisted Schema Reviews; REST, GraphQL and the API Contract; Versioning, Authentication Boundaries and API Gateways; and, from this module, the three cloud lessons. Any official documentation page you rely on for a product fact goes in your notes with the date you read it. Never paste real secrets, real customer data or a private company document into an assistant.`,
    },
    {
      id: `${P1}-s3`,
      text: `Step A: requirements and actors (about 45 minutes).
Name the product in one sentence and the problem it solves. List the actors (who uses or touches the system, including the tenant admin, a tenant's staff, an end customer, the platform operator, and any outside system such as an email or payment provider) and each actor's main goals. List the business requirements and the constraints (budget, team size, where data may be kept, deadlines). Then write the technical requirements and at least five quality targets in the scenario form from the Quality Attributes lesson: a stimulus, an environment, a response and a measure. Cover performance, availability, security, tenant isolation and scalability. A target without a number or a test is a wish, so give each one a number or a check you could run, and label every number as an assumption you chose. Save nothing in a tool yet; paste your final text under the heading "Requirements".`,
    },
    {
      id: `${P1}-s4`,
      text: `Step B: diagrams and component design (about 60 minutes).
In the Architecture Diagram Workbench, draw (1) a C4 context diagram (the system, its actors and outside systems), (2) a C4 container diagram (web app, API, database, queue or worker if you need one, object storage, outside providers) and (3) one C4 component view of the container with the most logic (for example the API). Keep each diagram small. Then write the component design: for each component in your view, one sentence of responsibility, what it depends on and what it must never do. State your architecture style (for example a modular monolith) and why a more distributed style is not needed yet, using the Trade-Off Matrix if the choice is close. Add a hosting sketch: which cloud building blocks you use (compute, storage, managed database, CDN, load balancer), in how many zones, and which blocks you buy and which you run, each with a reason. Save all three diagrams in the workbench and paste the final diagram text into your submission.`,
    },
    {
      id: `${P1}-s5`,
      text: `Step C: data and tenant isolation (about 60 minutes).
Draw the schema as an ER diagram: the main tables, their keys and how a row is tied to its tenant. Compare three tenant models from the Multi-Tenant Data Models lesson (shared schema with a tenant id, schema per tenant, database per tenant) against your requirements: isolation strength, cost, operations effort, and the effect of one very large tenant. Use the Trade-Off Matrix and keep your weights. Choose one, and write why you rejected each of the others, in a sentence that names a requirement. Then reason about isolation at three layers: data (how a missing filter is prevented, for example a tenant id on every table and a check in one place), application (how the tenant is identified on every request and kept out of shared caches and background jobs) and noisy neighbour (how one tenant's heavy use is limited so others are not slowed: per-tenant limits, queues, separate capacity for the biggest). List the isolation failures you think are most likely and how you would notice each one.`,
    },
    {
      id: `${P1}-s6`,
      text: `Step D: API, access and decisions (about 60 minutes).
Pick two key flows (for example "a customer opens a ticket" and "staff reply and close it"). For each, write a contract sketch: the request path and method, the main fields, the response, the errors, how a retry stays safe (an idempotency key where it matters) and how a long list is paged. Then write authentication and authorization: where users sign in, what the tenant boundary looks like in the token or session, the roles (for example owner, agent, read-only) with a table of what each can do, and where the check happens for every request. Finally, write at least three Architecture Decision Records with the ADR builder: the tenant isolation model, your architecture style or hosting choice, and one more (for example sync versus queued email, or managed versus self-run database). Each ADR needs the context, the options you considered, the decision, the consequences including the costs, and a trigger that would make you revisit it. Save each ADR in the builder and paste the final text of each into your submission.`,
    },
    {
      id: `${P1}-s7`,
      text: `Guided AI prompts
Use an assistant as a critic after you have written your own draft, never to write it for you. Replace the brackets with your own details, and keep a note of what you changed.
(1) Requirements critic: "Here is my product, actors and requirements: [paste]. List the assumptions I made, the requirements that are not measurable, the actors or goals I may have missed, and questions you would ask the product owner. Do not add requirements; ask."
(2) Diagram consistency: "Here are my context, container and component diagrams as text: [paste]. List any element that appears in one diagram and is missing or renamed in another, any arrow without a clear purpose, and any component that does more than one job."
(3) Isolation attack: "Here is my schema, my tenant model and my access rules: [paste]. Act as a reviewer. List the ways one tenant could see or slow down another, ordered by likelihood, and which of them my design already prevents. Say what you cannot judge from this text."
(4) Simplicity check: "Here is my design: [paste]. For each component and managed service, name the requirement that needs it, or say there is none. Describe a simpler design and the risk it leaves."
Ask the assistant to say what it is unsure of. Treat every answer as a hypothesis to test against your requirements, and record what you accepted, rejected and changed.`,
    },
    {
      id: `${P1}-s8`,
      text: `Deliverables
Paste into the submission box, under these headings: (1) Requirements: actors, goals, constraints, business requirements, technical requirements and at least five quality targets with a number or a test. (2) Diagrams: the final text of your context, container and component diagrams, which you also saved in the workbench. (3) Components and hosting: the component list with responsibilities, your style choice and the hosting sketch with buy-or-run reasons. (4) Data: the ER diagram text and the schema notes. (5) Isolation: the three models compared, the chosen one, the rejected alternatives with reasons, and the data, application and noisy-neighbour defences. (6) API: the contract sketch for two flows. (7) Access: authentication, roles table and where the tenant check happens. (8) At least three ADRs, also saved in the builder. (9) An AI log of 120 to 250 words: which prompts you used, one thing the assistant got wrong or missed, and what you changed because of it. The coach also receives the diagrams and ADRs you saved in the tools, so check they match what you paste.`,
    },
    {
      id: `${P1}-s9`,
      text: `Assessment criteria
A reviewer will check the rubric below, and in particular: whether every quality target has a number or a test; whether the three diagrams, the component list, the schema and the API use the same names and agree; whether tenant isolation is argued at the data, application and noisy-neighbour layers with a rejected alternative; whether the ADRs record trade-offs and a revisit trigger and not only the choice; whether each component, service and managed block traces back to a requirement; and whether your AI log shows your own judgment: what the assistant got wrong, what you changed, what you chose to ignore and why. Reasoning in your own words matters more than polish, and a smaller design with clear reasons beats a larger one with none.`,
    },
    {
      id: `${P1}-s10`,
      text: `Common mistakes
(1) Quality targets that are adjectives ("fast", "secure"): give a scenario, a number you chose and a test. (2) Diagrams that disagree: a box named "Worker" in one diagram and "Job runner" in another, or a database in the container view that is missing from the schema. Reread all three together. (3) Choosing a tenant model without a rejected alternative, or rejecting one for a reason that names no requirement. (4) Isolation that stops at "add a tenant id column": say where it is enforced, what happens if a developer forgets it, and how a cache and a background job keep the tenant. (5) Forgetting noisy neighbours: one big tenant's import can slow everyone. (6) ADRs that only state the decision. Add the options, the costs and a trigger to revisit. (7) Over-building: microservices, a Kubernetes cluster or several regions with no requirement behind them. (8) Pasting the assistant's design as your own: keep your draft, mark what you changed, and write the AI log yourself. (9) Putting real names, keys or customer data in a prompt or in the submission.`,
    },
    {
      id: `${P1}-s11`,
      audience: { max: 'beginner' },
      text: `For newcomers: a smaller, scaffolded version. Use StoreDesk and keep only the essentials. Requirements: three actors (shop owner, staff, customer), three business requirements and three quality targets (one about speed, one about keeping shops' tickets apart, one about being available). Diagrams: a context diagram and a container diagram only; the component view is optional. Data: four to six tables, with a tenant id on each one that belongs to a shop, and a short note on why you chose the shared-schema model and one reason you did not choose a separate database per shop. API: one flow, "a customer opens a ticket", with a path, the fields and two errors. Access: two roles. Write at least three ADRs, each only a few lines. After each assistant answer, write one sentence that says whether you agree and why.`,
    },
    {
      id: `${P1}-s12`,
      audience: { min: 'advanced' },
      text: `Professional extension. Add four things. (1) A migration path: how one very large tenant could move from a shared schema to its own database without downtime, and the trigger that starts it. (2) A tenant-aware cost view: which costs you would attribute per tenant, how you would measure them, and what you would do when one tenant costs far more than it pays. (3) A test plan treated as experiments: a tenant-leak test that must fail if a tenant filter is removed, a load test that shows a noisy tenant cannot starve others, and a failure drill for the database failover. State what result would change your design, and do not claim results you have not measured. (4) An architecture review: name who would review this design, which three questions you would ask them to challenge, and what evidence they should ask you for. Note anything that needs a security professional because the system holds high-risk data.`,
    },
  ],
  submission: {
    kind: 'text',
    label: 'Your multi-tenant SaaS architecture document',
    placeholder:
      'Requirements: actors, goals, constraints, quality targets with numbers or tests\n...\n\nDiagrams: context, container and component (final text)\n...\n\nComponents and hosting: responsibilities, style, buy or run\n...\n\nData: schema and ER diagram text\n...\n\nIsolation: models compared, chosen, rejected, three layers of defence\n...\n\nAPI: two flows as contract sketches\n...\n\nAccess: authentication, roles, tenant check\n...\n\nADRs (at least three)\n...\n\nAI log: prompts used, what the assistant got wrong or missed, what I changed\n...',
    hint:
      'Include all nine parts in order, your three diagrams as text, at least three ADRs, and an AI log in your own words. Save your diagrams and ADRs in the tools too, because the coach also receives them. Mark every number as an assumption you chose. Remove real names, keys and customer data.',
  },
  rubric: [
    'The requirements are measurable: each quality target has a stimulus, an environment, a response and a number or a test, and the actors, goals and constraints are explicit.',
    'The C4 context, container and component diagrams, the component list, the schema and the API agree with each other: the same names, no element missing from one that appears in another.',
    'Tenant isolation is reasoned at the data, application and noisy-neighbour layers, with the chosen model compared against at least one rejected alternative that names a requirement, and the cost of the choice stated.',
    'At least three ADRs record the context, the options considered, the decision, the consequences including costs, and a trigger to revisit, not only the choice.',
    'The design is the simplest that meets the stated requirements: every component, service and managed block traces to a requirement, and heavier options (microservices, an orchestrator, several regions) are rejected with a reason or justified by one.',
    'The AI log shows the learner\'s own judgment: which prompts were used, what the assistant got wrong or missed, what was changed, and what was ignored and why.',
  ],
  rubricExtra: [
    { audience: { max: 'beginner' }, items: ['A smaller scope is fine: two diagrams, four to six tables, one API flow and two roles, as long as every choice has a stated reason and the learner explains one thing the assistant got wrong.'] },
    { audience: { min: 'advanced' }, items: ['A migration path for one very large tenant and a tenant-aware cost view are included, each with a trigger and a way to measure it.', 'A test plan treats the tenant-leak test, the noisy-neighbour load test and the failover drill as experiments, with the result that would change the design, and claims no result that was not measured.'] },
    { audience: { min: 'professional' }, items: ['An architecture review plan names the reviewers, the questions they should ask and the evidence they should request, and flags what needs a security professional.'] },
  ],
};
