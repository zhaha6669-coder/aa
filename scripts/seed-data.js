const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...\n')

  // ==================== SERVICES ====================
  console.log('📦 Creating services...')
  
  const services = [
    {
      title: 'Web Development',
      titleAr: 'تطوير المواقع',
      slug: 'web-development',
      shortDescription: 'Blazing fast, SEO-optimized websites built with modern technologies.',
      shortDescAr: 'مواقع سريعة جداً ومحسّنة لمحركات البحث مبنية بأحدث التقنيات.',
      fullDescription: 'We build high-performance websites using Next.js, React, and modern web technologies. Our sites are optimized for speed, SEO, and user experience.',
      fullDescAr: 'نبني مواقع عالية الأداء باستخدام Next.js و React وأحدث تقنيات الويب. مواقعنا محسّنة للسرعة ومحركات البحث وتجربة المستخدم.',
      icon: '💻',
      features: JSON.stringify(['Next.js & React', 'WebGL 3D Experiences', 'Advanced SEO', 'Headless CMS']),
      featuresAr: JSON.stringify(['Next.js و React', 'تجارب 3D بـ WebGL', 'SEO متقدم', 'أنظمة إدارة محتوى']),
      pricingFrom: 2000,
      displayOrder: 1,
      isActive: true,
    },
    {
      title: 'UI/UX Design',
      titleAr: 'تصميم واجهات المستخدم',
      slug: 'ui-ux-design',
      shortDescription: 'Beautiful interfaces that users love to interact with.',
      shortDescAr: 'واجهات جميلة يحب المستخدمون التفاعل معها.',
      fullDescription: 'We create intuitive and visually stunning user interfaces. Our design process includes user research, wireframing, prototyping, and design systems.',
      fullDescAr: 'نصمم واجهات مستخدم بديهية ومذهلة بصرياً. عمليتنا تشمل بحث المستخدمين والتخطيط والنماذج الأولية وأنظمة التصميم.',
      icon: '🎨',
      features: JSON.stringify(['User Research', 'Wireframing', 'Interactive Prototyping', 'Design Systems']),
      featuresAr: JSON.stringify(['بحث المستخدمين', 'التخطيط الأولي', 'نماذج تفاعلية', 'أنظمة التصميم']),
      pricingFrom: 1500,
      displayOrder: 2,
      isActive: true,
    },
    {
      title: 'Mobile Apps',
      titleAr: 'تطبيقات الجوال',
      slug: 'mobile-apps',
      shortDescription: 'Native performance apps for iOS & Android platforms.',
      shortDescAr: 'تطبيقات بأداء أصلي لمنصات iOS و Android.',
      fullDescription: 'We develop cross-platform mobile applications using React Native and Flutter. Our apps deliver native performance with beautiful UI.',
      fullDescAr: 'نطور تطبيقات جوال متعددة المنصات باستخدام React Native و Flutter. تطبيقاتنا تقدم أداء أصلي مع واجهة جميلة.',
      icon: '📱',
      features: JSON.stringify(['React Native', 'Flutter Cross-Platform', 'iOS Swift', 'Android Kotlin']),
      featuresAr: JSON.stringify(['React Native', 'Flutter متعدد المنصات', 'iOS Swift', 'Android Kotlin']),
      pricingFrom: 5000,
      displayOrder: 3,
      isActive: true,
    },
    {
      title: 'Cloud Solutions',
      titleAr: 'حلول سحابية',
      slug: 'cloud-solutions',
      shortDescription: 'Scalable infrastructure that grows with your business.',
      shortDescAr: 'بنية تحتية قابلة للتوسع تنمو مع عملك.',
      fullDescription: 'We architect and deploy cloud solutions on AWS, Google Cloud, and Vercel. Our infrastructure is designed for scale, security, and reliability.',
      fullDescAr: 'نصمم وننشر حلول سحابية على AWS و Google Cloud و Vercel. بنيتنا التحتية مصممة للتوسع والأمان والموثوقية.',
      icon: '☁️',
      features: JSON.stringify(['AWS Architecture', 'Vercel Edge', 'Database Scaling', 'Cybersecurity']),
      featuresAr: JSON.stringify(['هندسة AWS', 'Vercel Edge', 'توسيع قواعد البيانات', 'الأمن السيبراني']),
      pricingFrom: 3000,
      displayOrder: 4,
      isActive: true,
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    })
  }
  console.log(`✅ Created ${services.length} services\n`)

  // ==================== PROJECTS ====================
  console.log('🎨 Creating projects...')
  
  const projects = [
    {
      title: 'E-Commerce Revolution',
      titleAr: 'ثورة التجارة الإلكترونية',
      slug: 'ecommerce-revolution',
      description: 'A blazing-fast online store with AI-powered recommendations and seamless checkout experience.',
      descriptionAr: 'متجر إلكتروني سريع جداً مع توصيات مدعومة بالذكاء الاصطناعي وتجربة شراء سلسة.',
      category: 'Web',
      technologies: JSON.stringify(['Next.js', 'Stripe', 'AI', 'Tailwind']),
      clientName: 'TechStore Inc.',
      featured: true,
      displayOrder: 1,
      status: 'published',
    },
    {
      title: 'FinTech Dashboard',
      titleAr: 'لوحة تحكم مالية',
      slug: 'fintech-dashboard',
      description: 'Real-time financial analytics platform with advanced data visualization and reporting.',
      descriptionAr: 'منصة تحليلات مالية في الوقت الفعلي مع تصور بيانات متقدم وتقارير شاملة.',
      category: 'SaaS',
      technologies: JSON.stringify(['React', 'D3.js', 'WebSockets', 'Node.js']),
      clientName: 'FinanceHub',
      featured: true,
      displayOrder: 2,
      status: 'published',
    },
    {
      title: 'Healthcare App',
      titleAr: 'تطبيق الرعاية الصحية',
      slug: 'healthcare-app',
      description: 'HIPAA-compliant telemedicine platform connecting patients and doctors seamlessly.',
      descriptionAr: 'منصة طب عن بعد متوافقة مع HIPAA تربط المرضى والأطباء بسلاسة.',
      category: 'Mobile',
      technologies: JSON.stringify(['React Native', 'Video SDK', 'HIPAA', 'Firebase']),
      clientName: 'HealthConnect',
      featured: true,
      displayOrder: 3,
      status: 'published',
    },
    {
      title: 'Real Estate Portal',
      titleAr: 'بوابة العقارات',
      slug: 'real-estate-portal',
      description: 'Property listing platform with 3D virtual tours and mortgage calculators.',
      descriptionAr: 'منصة قوائم عقارية مع جولات افتراضية ثلاثية الأبعاد وحاسبات الرهن العقاري.',
      category: 'Web',
      technologies: JSON.stringify(['Next.js', 'Three.js', 'Maps API', 'PostgreSQL']),
      clientName: 'PropTech Solutions',
      featured: false,
      displayOrder: 4,
      status: 'published',
    },
    {
      title: 'Social Media Hub',
      titleAr: 'منصة التواصل الاجتماعي',
      slug: 'social-media-hub',
      description: 'Community-driven platform with real-time messaging and content curation.',
      descriptionAr: 'منصة مجتمعية مع رسائل فورية وتنسيق المحتوى.',
      category: 'SaaS',
      technologies: JSON.stringify(['Node.js', 'Socket.io', 'Redis', 'MongoDB']),
      clientName: 'SocialTech',
      featured: false,
      displayOrder: 5,
      status: 'published',
    },
    {
      title: 'Fitness Tracker',
      titleAr: 'متتبع اللياقة',
      slug: 'fitness-tracker',
      description: 'Smart workout companion with AI coaching and progress analytics.',
      descriptionAr: 'رفيق تمارين ذكي مع تدريب بالذكاء الاصطناعي وتحليلات التقدم.',
      category: 'Mobile',
      technologies: JSON.stringify(['Flutter', 'ML Kit', 'Firebase', 'HealthKit']),
      clientName: 'FitLife',
      featured: false,
      displayOrder: 6,
      status: 'published',
    },
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    })
  }
  console.log(`✅ Created ${projects.length} projects\n`)

  // ==================== TESTIMONIALS ====================
  console.log('💬 Creating testimonials...')
  
  const testimonials = [
    {
      quote: 'Lumina transformed our online presence completely. The website they built is not just beautiful, it\'s a conversion machine. Our sales increased by 150% in the first quarter!',
      quoteAr: 'غيّرت Lumina وجودنا الرقمي بالكامل. الموقع الذي بنوه ليس جميلاً فحسب، بل هو آلة تحويل. زادت مبيعاتنا بنسبة 150% في الربع الأول!',
      authorName: 'Sarah Mitchell',
      authorRole: 'CEO',
      authorRoleAr: 'الرئيس التنفيذي',
      authorCompany: 'TechFlow Solutions',
      rating: 5,
      featured: true,
      approved: true,
      displayOrder: 1,
    },
    {
      quote: 'Working with Lumina was a breath of fresh air. They understood our vision and delivered beyond expectations. The app is fast, intuitive, and our users absolutely love it.',
      quoteAr: 'العمل مع Lumina كان نسمة هواء منعشة. فهموا رؤيتنا وقدموا ما يفوق التوقعات. التطبيق سريع وبديهي ومستخدمونا يحبونه جداً.',
      authorName: 'Marcus Chen',
      authorRole: 'Founder',
      authorRoleAr: 'المؤسس',
      authorCompany: 'HealthConnect',
      rating: 5,
      featured: true,
      approved: true,
      displayOrder: 2,
    },
    {
      quote: 'The team at Lumina didn\'t just code our platform - they became strategic partners. Their insights on UX and performance optimization were game-changing.',
      quoteAr: 'فريق Lumina لم يبرمج منصتنا فحسب - بل أصبحوا شركاء استراتيجيين. رؤاهم حول تجربة المستخدم وتحسين الأداء كانت ثورية.',
      authorName: 'Emily Rodriguez',
      authorRole: 'CTO',
      authorRoleAr: 'الرئيس التقني',
      authorCompany: 'FinanceHub',
      rating: 5,
      featured: true,
      approved: true,
      displayOrder: 3,
    },
    {
      quote: 'From concept to launch, Lumina handled everything professionally. The result? A scalable platform that grows with our business. Highly recommended!',
      quoteAr: 'من الفكرة إلى الإطلاق، تعامل Lumina مع كل شيء باحترافية. النتيجة؟ منصة قابلة للتوسع تنمو مع أعمالنا. أنصح بهم بشدة!',
      authorName: 'David Thompson',
      authorRole: 'Product Manager',
      authorRoleAr: 'مدير المنتج',
      authorCompany: 'EduTech Pro',
      rating: 5,
      featured: false,
      approved: true,
      displayOrder: 4,
    },
  ]

  for (const testimonial of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { authorName: testimonial.authorName }
    })
    if (!existing) {
      await prisma.testimonial.create({ data: testimonial })
    }
  }
  console.log(`✅ Created ${testimonials.length} testimonials\n`)

  // ==================== TEAM MEMBERS ====================
  console.log('👥 Creating team members...')
  
  const teamMembers = [
    {
      name: 'Ahmed Hassan',
      nameAr: 'أحمد حسن',
      role: 'CEO & Founder',
      roleAr: 'المؤسس والرئيس التنفيذي',
      bio: 'Visionary leader with 10+ years in tech.',
      bioAr: 'قائد صاحب رؤية مع أكثر من 10 سنوات في التقنية.',
      linkedin: 'https://linkedin.com/in/ahmedhassan',
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'Sara Ali',
      nameAr: 'سارة علي',
      role: 'Lead Designer',
      roleAr: 'مديرة التصميم',
      bio: 'Creative mind behind our stunning designs.',
      bioAr: 'العقل المبدع وراء تصاميمنا المذهلة.',
      linkedin: 'https://linkedin.com/in/saraali',
      displayOrder: 2,
      isActive: true,
    },
    {
      name: 'Omar Khalid',
      nameAr: 'عمر خالد',
      role: 'Tech Lead',
      roleAr: 'قائد الفريق التقني',
      bio: 'Full-stack expert with passion for clean code.',
      bioAr: 'خبير Full-stack مع شغف بالكود النظيف.',
      github: 'https://github.com/omarkhalid',
      displayOrder: 3,
      isActive: true,
    },
    {
      name: 'Fatima Noor',
      nameAr: 'فاطمة نور',
      role: 'Project Manager',
      roleAr: 'مديرة المشاريع',
      bio: 'Keeps projects on track and clients happy.',
      bioAr: 'تحافظ على المشاريع في مسارها والعملاء سعداء.',
      linkedin: 'https://linkedin.com/in/fatimanoor',
      displayOrder: 4,
      isActive: true,
    },
  ]

  for (const member of teamMembers) {
    const existing = await prisma.teamMember.findFirst({
      where: { name: member.name }
    })
    if (!existing) {
      await prisma.teamMember.create({ data: member })
    }
  }
  console.log(`✅ Created ${teamMembers.length} team members\n`)

  // ==================== STATS ====================
  console.log('📊 Creating stats...')
  
  const stats = [
    { key: 'projects_completed', value: 50 },
    { key: 'happy_clients', value: 30 },
    { key: 'satisfaction_rate', value: 98 },
    { key: 'years_experience', value: 5 },
  ]

  for (const stat of stats) {
    await prisma.siteStat.upsert({
      where: { key: stat.key },
      update: { value: stat.value },
      create: stat,
    })
  }
  console.log(`✅ Created ${stats.length} stats\n`)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
