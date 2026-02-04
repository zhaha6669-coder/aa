-- Lumina Agency - Seed Data for Full CMS Control
-- This file inserts initial data to get the site working immediately

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ==================== SITE SETTINGS ====================

INSERT INTO `Setting` (`id`, `key`, `value`, `valueAr`, `type`, `group`, `label`, `labelAr`, `isPublic`) VALUES
-- General Settings
(UUID(), 'site_name', 'Lumina Agency', 'وكالة لومينا', 'string', 'general', 'Site Name', 'اسم الموقع', true),
(UUID(), 'site_tagline', 'Digital Excellence', 'التميز الرقمي', 'string', 'general', 'Tagline', 'الشعار', true),
(UUID(), 'site_description', 'We create stunning digital experiences that transform brands and drive growth.', 'نصنع تجارب رقمية مذهلة تحوّل العلامات التجارية وتدفع النمو.', 'text', 'general', 'Site Description', 'وصف الموقع', true),
(UUID(), 'site_logo', '/images/logo.png', '/images/logo.png', 'string', 'general', 'Logo URL', 'رابط الشعار', true),
(UUID(), 'site_favicon', '/favicon.ico', '/favicon.ico', 'string', 'general', 'Favicon', 'أيقونة الموقع', true),

-- Contact Settings
(UUID(), 'contact_email', 'hello@lumina.agency', 'hello@lumina.agency', 'string', 'contact', 'Contact Email', 'البريد الإلكتروني', true),
(UUID(), 'contact_phone', '+1 (555) 123-4567', '+1 (555) 123-4567', 'string', 'contact', 'Phone Number', 'رقم الهاتف', true),
(UUID(), 'contact_address', '123 Innovation Street, Tech City, TC 12345', '123 شارع الابتكار، مدينة التقنية', 'string', 'contact', 'Address', 'العنوان', true),
(UUID(), 'contact_whatsapp', '+15551234567', '+15551234567', 'string', 'contact', 'WhatsApp', 'واتساب', true),

-- SEO Settings
(UUID(), 'seo_meta_title', 'Lumina Agency | Digital Excellence', 'وكالة لومينا | التميز الرقمي', 'string', 'seo', 'Default Meta Title', 'عنوان الميتا الافتراضي', false),
(UUID(), 'seo_meta_description', 'Transform your digital presence with Lumina Agency - Web Development, Mobile Apps, and Digital Marketing experts.', 'حوّل حضورك الرقمي مع وكالة لومينا - خبراء تطوير الويب والتطبيقات والتسويق الرقمي.', 'text', 'seo', 'Default Meta Description', 'وصف الميتا الافتراضي', false),
(UUID(), 'seo_keywords', 'web development, mobile apps, digital marketing, branding, UI/UX design', 'تطوير ويب، تطبيقات موبايل، تسويق رقمي، هوية بصرية، تصميم واجهات', 'text', 'seo', 'Keywords', 'الكلمات المفتاحية', false),

-- Hero Section
(UUID(), 'hero_title', 'Digital Excellence', 'التميز الرقمي', 'string', 'hero', 'Hero Title', 'عنوان البطل', true),
(UUID(), 'hero_subtitle', 'We create stunning digital experiences that transform brands and drive growth.', 'نصنع تجارب رقمية مذهلة تحوّل العلامات التجارية وتدفع النمو.', 'text', 'hero', 'Hero Subtitle', 'العنوان الفرعي', true),
(UUID(), 'hero_cta_text', 'Start Your Project', 'ابدأ مشروعك', 'string', 'hero', 'CTA Button Text', 'نص زر الدعوة للعمل', true),
(UUID(), 'hero_cta_link', '/contact', '/contact', 'string', 'hero', 'CTA Link', 'رابط زر الدعوة للعمل', true),

-- About Section
(UUID(), 'about_title', 'Who We Are', 'من نحن', 'string', 'about', 'About Title', 'عنوان من نحن', true),
(UUID(), 'about_content', 'We are a team of passionate designers, developers, and strategists dedicated to creating exceptional digital experiences. With years of expertise, we help businesses thrive in the digital age.', 'نحن فريق من المصممين والمطورين والاستراتيجيين المتحمسين المكرسين لإنشاء تجارب رقمية استثنائية. بخبرة سنوات، نساعد الشركات على الازدهار في العصر الرقمي.', 'text', 'about', 'About Content', 'محتوى من نحن', true),

-- Footer Settings
(UUID(), 'footer_copyright', '© 2024 Lumina Agency. All rights reserved.', '© 2024 وكالة لومينا. جميع الحقوق محفوظة.', 'string', 'footer', 'Copyright Text', 'نص حقوق النشر', true),

-- Analytics
(UUID(), 'google_analytics_id', '', '', 'string', 'analytics', 'Google Analytics ID', 'معرف Google Analytics', false),
(UUID(), 'facebook_pixel_id', '', '', 'string', 'analytics', 'Facebook Pixel ID', 'معرف Facebook Pixel', false);


-- ==================== SOCIAL LINKS ====================

INSERT INTO `SocialLink` (`id`, `platform`, `url`, `icon`, `displayOrder`, `isActive`) VALUES
(UUID(), 'facebook', 'https://facebook.com/luminaagency', 'facebook', 1, true),
(UUID(), 'twitter', 'https://twitter.com/luminaagency', 'twitter', 2, true),
(UUID(), 'instagram', 'https://instagram.com/luminaagency', 'instagram', 3, true),
(UUID(), 'linkedin', 'https://linkedin.com/company/luminaagency', 'linkedin', 4, true),
(UUID(), 'github', 'https://github.com/luminaagency', 'github', 5, true),
(UUID(), 'youtube', 'https://youtube.com/@luminaagency', 'youtube', 6, true),
(UUID(), 'dribbble', 'https://dribbble.com/luminaagency', 'dribbble', 7, false);


-- ==================== CATEGORIES ====================

-- Service Categories
INSERT INTO `Category` (`id`, `name`, `nameAr`, `slug`, `description`, `descriptionAr`, `type`, `displayOrder`) VALUES
(UUID(), 'Web Development', 'تطوير الويب', 'web-development', 'Custom websites and web applications', 'مواقع وتطبيقات ويب مخصصة', 'service', 1),
(UUID(), 'Mobile Development', 'تطوير التطبيقات', 'mobile-development', 'iOS and Android applications', 'تطبيقات iOS و Android', 'service', 2),
(UUID(), 'Digital Marketing', 'التسويق الرقمي', 'digital-marketing', 'SEO, PPC, Social Media Marketing', 'تحسين محركات البحث، الإعلانات، التسويق عبر وسائل التواصل', 'service', 3),
(UUID(), 'Branding', 'الهوية البصرية', 'branding', 'Logo design and brand identity', 'تصميم الشعارات والهوية البصرية', 'service', 4),
(UUID(), 'UI/UX Design', 'تصميم الواجهات', 'ui-ux-design', 'User interface and experience design', 'تصميم واجهات وتجارب المستخدم', 'service', 5);

-- Project Categories
INSERT INTO `Category` (`id`, `name`, `nameAr`, `slug`, `description`, `descriptionAr`, `type`, `displayOrder`) VALUES
(UUID(), 'E-Commerce', 'التجارة الإلكترونية', 'ecommerce', 'Online stores and marketplaces', 'متاجر إلكترونية وأسواق', 'project', 1),
(UUID(), 'Corporate', 'الشركات', 'corporate', 'Business and corporate websites', 'مواقع الأعمال والشركات', 'project', 2),
(UUID(), 'SaaS', 'برمجيات كخدمة', 'saas', 'Software as a service applications', 'تطبيقات برمجية كخدمة', 'project', 3),
(UUID(), 'Healthcare', 'الرعاية الصحية', 'healthcare', 'Medical and healthcare solutions', 'حلول طبية وصحية', 'project', 4);

-- Blog Categories
INSERT INTO `Category` (`id`, `name`, `nameAr`, `slug`, `description`, `descriptionAr`, `type`, `displayOrder`) VALUES
(UUID(), 'Technology', 'التقنية', 'technology', 'Tech news and tutorials', 'أخبار ودروس تقنية', 'blog', 1),
(UUID(), 'Design', 'التصميم', 'design', 'Design tips and inspiration', 'نصائح وإلهام التصميم', 'blog', 2),
(UUID(), 'Business', 'الأعمال', 'business', 'Business insights and strategies', 'رؤى واستراتيجيات الأعمال', 'blog', 3);


-- ==================== SERVICES ====================

INSERT INTO `Service` (`id`, `title`, `titleAr`, `slug`, `shortDescription`, `shortDescAr`, `fullDescription`, `fullDescAr`, `icon`, `features`, `featuresAr`, `pricingFrom`, `pricingTo`, `currency`, `displayOrder`, `isActive`) VALUES
(UUID(), 'Web Development', 'تطوير الويب', 'web-development', 
'Custom websites built with cutting-edge technologies for optimal performance.',
'مواقع مخصصة مبنية بأحدث التقنيات لأداء مثالي.',
'<h2>Transform Your Online Presence</h2><p>We build fast, secure, and scalable websites using modern technologies like Next.js, React, and Node.js. Our development process focuses on clean code, SEO optimization, and exceptional user experience.</p><h3>Our Web Development Process</h3><ul><li>Discovery & Planning</li><li>UI/UX Design</li><li>Development & Testing</li><li>Launch & Optimization</li></ul>',
'<h2>حوّل حضورك على الإنترنت</h2><p>نبني مواقع سريعة وآمنة وقابلة للتطوير باستخدام تقنيات حديثة مثل Next.js و React و Node.js. تركز عملية التطوير لدينا على الكود النظيف وتحسين محركات البحث وتجربة المستخدم الاستثنائية.</p>',
'code', 
'["Responsive Design", "SEO Optimized", "Fast Loading", "CMS Integration", "E-commerce Ready", "Security First"]',
'["تصميم متجاوب", "محسّن لمحركات البحث", "تحميل سريع", "تكامل نظام إدارة المحتوى", "جاهز للتجارة الإلكترونية", "الأمان أولاً"]',
2000, 25000, 'USD', 1, true),

(UUID(), 'Mobile App Development', 'تطوير تطبيقات الموبايل', 'mobile-app-development',
'Native and cross-platform mobile apps that deliver exceptional user experiences.',
'تطبيقات موبايل أصلية ومتعددة المنصات تقدم تجارب مستخدم استثنائية.',
'<h2>Mobile Apps That Users Love</h2><p>We create powerful mobile applications for iOS and Android using React Native and Flutter. Our apps are designed for performance, usability, and engagement.</p>',
'<h2>تطبيقات يحبها المستخدمون</h2><p>نصنع تطبيقات موبايل قوية لـ iOS و Android باستخدام React Native و Flutter. تطبيقاتنا مصممة للأداء وسهولة الاستخدام والتفاعل.</p>',
'smartphone',
'["iOS & Android", "Cross-platform", "Offline Support", "Push Notifications", "App Store Optimization", "Analytics Integration"]',
'["iOS و Android", "متعدد المنصات", "دعم بدون إنترنت", "إشعارات فورية", "تحسين متجر التطبيقات", "تكامل التحليلات"]',
5000, 50000, 'USD', 2, true),

(UUID(), 'Digital Marketing', 'التسويق الرقمي', 'digital-marketing',
'Data-driven marketing strategies that increase visibility and drive conversions.',
'استراتيجيات تسويق مدعومة بالبيانات تزيد الظهور وتحفز التحويلات.',
'<h2>Grow Your Business Online</h2><p>Our digital marketing services combine SEO, PPC, social media, and content marketing to help you reach your target audience and achieve measurable results.</p>',
'<h2>نمِّ عملك على الإنترنت</h2><p>خدمات التسويق الرقمي لدينا تجمع بين تحسين محركات البحث والإعلانات المدفوعة ووسائل التواصل الاجتماعي وتسويق المحتوى لمساعدتك في الوصول إلى جمهورك المستهدف.</p>',
'trending-up',
'["SEO Optimization", "PPC Campaigns", "Social Media Marketing", "Content Strategy", "Email Marketing", "Analytics & Reporting"]',
'["تحسين محركات البحث", "حملات إعلانية", "تسويق عبر وسائل التواصل", "استراتيجية المحتوى", "التسويق بالبريد الإلكتروني", "التحليلات والتقارير"]',
1000, 10000, 'USD', 3, true),

(UUID(), 'Brand Identity', 'الهوية البصرية', 'brand-identity',
'Memorable brand identities that resonate with your target audience.',
'هويات بصرية لا تُنسى تتواصل مع جمهورك المستهدف.',
'<h2>Build a Brand That Stands Out</h2><p>We create comprehensive brand identities including logos, color palettes, typography, and brand guidelines that tell your unique story and connect with your audience.</p>',
'<h2>ابنِ علامة تجارية مميزة</h2><p>نصنع هويات بصرية شاملة تتضمن الشعارات ولوحات الألوان والخطوط ودليل الهوية التي تروي قصتك الفريدة.</p>',
'palette',
'["Logo Design", "Brand Guidelines", "Color Palette", "Typography", "Business Cards", "Social Media Kit"]',
'["تصميم الشعار", "دليل الهوية", "لوحة الألوان", "الخطوط", "بطاقات العمل", "حزمة وسائل التواصل"]',
1500, 15000, 'USD', 4, true),

(UUID(), 'UI/UX Design', 'تصميم الواجهات', 'ui-ux-design',
'User-centered design that creates intuitive and delightful digital experiences.',
'تصميم يركز على المستخدم ويخلق تجارب رقمية بديهية ومبهجة.',
'<h2>Design That Users Love</h2><p>Our UI/UX design process combines research, wireframing, prototyping, and testing to create interfaces that are both beautiful and functional.</p>',
'<h2>تصميم يحبه المستخدمون</h2><p>عملية تصميم UI/UX لدينا تجمع بين البحث والتخطيط والنمذجة والاختبار لإنشاء واجهات جميلة وعملية.</p>',
'layers',
'["User Research", "Wireframing", "Prototyping", "Usability Testing", "Design Systems", "Interaction Design"]',
'["بحث المستخدم", "التخطيط الشبكي", "النمذجة", "اختبار قابلية الاستخدام", "أنظمة التصميم", "تصميم التفاعل"]',
2000, 20000, 'USD', 5, true);


-- ==================== PROJECTS / PORTFOLIO ====================

INSERT INTO `Project` (`id`, `title`, `titleAr`, `slug`, `description`, `descriptionAr`, `technologies`, `clientName`, `completionDate`, `featured`, `images`, `status`, `displayOrder`) VALUES
(UUID(), 'TechFlow SaaS Platform', 'منصة تيك فلو', 'techflow-saas-platform',
'A comprehensive SaaS platform for project management with real-time collaboration, task tracking, and analytics dashboard.',
'منصة SaaS شاملة لإدارة المشاريع مع التعاون في الوقت الفعلي وتتبع المهام ولوحة تحليلات.',
'Next.js, TypeScript, PostgreSQL, Redis, AWS',
'TechFlow Inc.',
'2024-01-15 00:00:00',
true,
'["/images/projects/techflow-1.jpg", "/images/projects/techflow-2.jpg"]',
'published', 1),

(UUID(), 'HealthHub Mobile App', 'تطبيق هيلث هب', 'healthhub-mobile-app',
'A healthcare mobile app connecting patients with doctors, featuring appointment booking, telemedicine, and health tracking.',
'تطبيق صحي يربط المرضى بالأطباء، يتضمن حجز المواعيد والطب عن بعد وتتبع الصحة.',
'React Native, Node.js, MongoDB, Socket.io',
'HealthHub Medical',
'2024-02-20 00:00:00',
true,
'["/images/projects/healthhub-1.jpg", "/images/projects/healthhub-2.jpg"]',
'published', 2),

(UUID(), 'LuxeStore E-Commerce', 'متجر لوكس', 'luxestore-ecommerce',
'A premium e-commerce platform for luxury goods with advanced filtering, AR product preview, and seamless checkout.',
'منصة تجارة إلكترونية فاخرة للسلع الراقية مع تصفية متقدمة ومعاينة المنتجات بالواقع المعزز.',
'Next.js, Shopify, Tailwind CSS, Stripe',
'LuxeStore',
'2024-03-10 00:00:00',
true,
'["/images/projects/luxestore-1.jpg", "/images/projects/luxestore-2.jpg"]',
'published', 3),

(UUID(), 'GreenEnergy Dashboard', 'لوحة تحكم الطاقة الخضراء', 'greenenergy-dashboard',
'An analytics dashboard for renewable energy monitoring with real-time data visualization and predictive insights.',
'لوحة تحليلات لمراقبة الطاقة المتجددة مع تصور البيانات في الوقت الفعلي ورؤى تنبؤية.',
'React, D3.js, Python, TensorFlow, AWS',
'GreenEnergy Corp',
'2024-01-25 00:00:00',
false,
'["/images/projects/greenenergy-1.jpg"]',
'published', 4);


-- ==================== TEAM MEMBERS ====================

INSERT INTO `TeamMember` (`id`, `name`, `nameAr`, `role`, `roleAr`, `bio`, `bioAr`, `image`, `linkedin`, `twitter`, `github`, `displayOrder`, `isActive`) VALUES
(UUID(), 'Sarah Johnson', 'سارة جونسون', 'CEO & Founder', 'المديرة التنفيذية والمؤسسة',
'With over 15 years of experience in digital strategy, Sarah leads Lumina with a vision of creating impactful digital experiences.',
'بخبرة تزيد عن 15 عامًا في الاستراتيجية الرقمية، تقود سارة لومينا برؤية لإنشاء تجارب رقمية مؤثرة.',
'/images/team/sarah.jpg', 'https://linkedin.com/in/sarahjohnson', 'https://twitter.com/sarahjohnson', null, 1, true),

(UUID(), 'Michael Chen', 'مايكل تشين', 'CTO', 'المدير التقني',
'Michael brings 12 years of software engineering expertise, specializing in scalable architectures and emerging technologies.',
'يجلب مايكل 12 عامًا من الخبرة في هندسة البرمجيات، متخصص في البنيات القابلة للتطوير والتقنيات الناشئة.',
'/images/team/michael.jpg', 'https://linkedin.com/in/michaelchen', null, 'https://github.com/michaelchen', 2, true),

(UUID(), 'Emily Rodriguez', 'إيميلي رودريغز', 'Creative Director', 'المديرة الإبداعية',
'Emily crafts visual stories that connect brands with their audiences, with expertise in branding and digital design.',
'تصنع إيميلي قصصًا بصرية تربط العلامات التجارية بجماهيرها، بخبرة في الهوية البصرية والتصميم الرقمي.',
'/images/team/emily.jpg', 'https://linkedin.com/in/emilyrodriguez', 'https://twitter.com/emilyrodriguez', null, 3, true),

(UUID(), 'David Kim', 'ديفيد كيم', 'Lead Developer', 'المطور الرئيسي',
'David leads our development team with a passion for clean code and innovative solutions.',
'يقود ديفيد فريق التطوير لدينا بشغف للكود النظيف والحلول المبتكرة.',
'/images/team/david.jpg', 'https://linkedin.com/in/davidkim', null, 'https://github.com/davidkim', 4, true);


-- ==================== TESTIMONIALS ====================

INSERT INTO `Testimonial` (`id`, `quote`, `quoteAr`, `authorName`, `authorRole`, `authorRoleAr`, `authorCompany`, `authorImage`, `rating`, `featured`, `approved`, `displayOrder`) VALUES
(UUID(), 
'Lumina transformed our online presence completely. Their attention to detail and creative approach exceeded our expectations. Our conversion rate increased by 150% within three months.',
'حوّلت لومينا حضورنا على الإنترنت بالكامل. اهتمامهم بالتفاصيل ونهجهم الإبداعي تجاوز توقعاتنا. زادت معدل التحويل لدينا بنسبة 150% خلال ثلاثة أشهر.',
'Jessica Miller', 'Marketing Director', 'مديرة التسويق', 'TechCorp Solutions', '/images/testimonials/jessica.jpg', 5, true, true, 1),

(UUID(),
'The mobile app they developed for us has received outstanding reviews from our users. Professional team with excellent communication.',
'التطبيق الذي طوروه لنا تلقى تقييمات رائعة من مستخدمينا. فريق محترف مع تواصل ممتاز.',
'Ahmed Hassan', 'CEO', 'المدير التنفيذي', 'HealthTech Pro', '/images/testimonials/ahmed.jpg', 5, true, true, 2),

(UUID(),
'Working with Lumina was a game-changer for our brand. They truly understood our vision and brought it to life beautifully.',
'العمل مع لومينا كان نقطة تحول لعلامتنا التجارية. فهموا رؤيتنا حقًا وجسدوها بشكل جميل.',
'Maria Santos', 'Founder', 'المؤسسة', 'Creative Studios', '/images/testimonials/maria.jpg', 5, true, true, 3),

(UUID(),
'The ROI on our digital marketing investment with Lumina has been exceptional. They deliver results, not just promises.',
'العائد على استثمارنا في التسويق الرقمي مع لومينا كان استثنائيًا. يقدمون نتائج وليس مجرد وعود.',
'Robert Chen', 'VP of Marketing', 'نائب رئيس التسويق', 'E-Commerce Giant', '/images/testimonials/robert.jpg', 5, false, true, 4);


-- ==================== PRICING PLANS ====================

INSERT INTO `PricingPlan` (`id`, `name`, `nameAr`, `description`, `descriptionAr`, `price`, `currency`, `period`, `features`, `featuresAr`, `highlighted`, `displayOrder`, `isActive`) VALUES
(UUID(), 'Starter', 'المبتدئ', 
'Perfect for small businesses getting started online', 
'مثالي للشركات الصغيرة التي تبدأ على الإنترنت',
999, 'USD', 'one-time',
'["5 Page Website", "Mobile Responsive", "Basic SEO", "Contact Form", "1 Month Support"]',
'["موقع 5 صفحات", "متجاوب مع الموبايل", "SEO أساسي", "نموذج اتصال", "دعم شهر واحد"]',
false, 1, true),

(UUID(), 'Professional', 'المحترف', 
'Ideal for growing businesses needing more features', 
'مثالي للشركات النامية التي تحتاج المزيد من الميزات',
2999, 'USD', 'one-time',
'["15 Page Website", "Custom Design", "Advanced SEO", "CMS Integration", "E-commerce Ready", "3 Months Support", "Analytics Setup"]',
'["موقع 15 صفحة", "تصميم مخصص", "SEO متقدم", "تكامل CMS", "جاهز للتجارة الإلكترونية", "دعم 3 أشهر", "إعداد التحليلات"]',
true, 2, true),

(UUID(), 'Enterprise', 'المؤسسات', 
'For large organizations with complex requirements', 
'للمنظمات الكبيرة ذات المتطلبات المعقدة',
9999, 'USD', 'one-time',
'["Unlimited Pages", "Custom Development", "API Integrations", "Multi-language", "Priority Support", "Dedicated Manager", "Performance Optimization", "Security Audit"]',
'["صفحات غير محدودة", "تطوير مخصص", "تكامل APIs", "متعدد اللغات", "دعم أولوية", "مدير مخصص", "تحسين الأداء", "تدقيق أمني"]',
false, 3, true);


-- ==================== FAQ ====================

INSERT INTO `FAQ` (`id`, `question`, `questionAr`, `answer`, `answerAr`, `displayOrder`, `isActive`) VALUES
(UUID(), 
'How long does it take to build a website?',
'كم يستغرق بناء موقع ويب؟',
'The timeline depends on the project complexity. A simple website typically takes 2-4 weeks, while more complex projects can take 2-3 months. We\'ll provide a detailed timeline after understanding your requirements.',
'يعتمد الجدول الزمني على تعقيد المشروع. موقع بسيط يستغرق عادة 2-4 أسابيع، بينما المشاريع الأكثر تعقيدًا قد تستغرق 2-3 أشهر. سنقدم جدولًا زمنيًا مفصلًا بعد فهم متطلباتك.',
1, true),

(UUID(),
'What technologies do you use?',
'ما التقنيات التي تستخدمونها؟',
'We use modern technologies including React, Next.js, Node.js, Python, React Native, and cloud platforms like AWS and Vercel. We select the best tech stack based on your project needs.',
'نستخدم تقنيات حديثة تشمل React و Next.js و Node.js و Python و React Native ومنصات سحابية مثل AWS و Vercel. نختار أفضل مجموعة تقنية بناءً على احتياجات مشروعك.',
2, true),

(UUID(),
'Do you provide ongoing support?',
'هل تقدمون دعمًا مستمرًا؟',
'Yes! We offer various support packages ranging from basic maintenance to comprehensive support with dedicated account managers. We\'re here to ensure your digital products continue to perform optimally.',
'نعم! نقدم حزم دعم متنوعة تتراوح من الصيانة الأساسية إلى الدعم الشامل مع مديري حسابات مخصصين. نحن هنا لضمان استمرار منتجاتك الرقمية بالأداء الأمثل.',
3, true),

(UUID(),
'What is your pricing model?',
'ما هو نموذج التسعير لديكم؟',
'We offer both fixed-price projects and retainer models. For most projects, we provide a detailed quote after the discovery phase. Our pricing is transparent with no hidden fees.',
'نقدم كلاً من المشاريع بسعر ثابت ونماذج الاشتراك. لمعظم المشاريع، نقدم عرض أسعار مفصل بعد مرحلة الاكتشاف. تسعيرنا شفاف بدون رسوم مخفية.',
4, true),

(UUID(),
'Can you redesign my existing website?',
'هل يمكنكم إعادة تصميم موقعي الحالي؟',
'Absolutely! We specialize in website redesigns and can help modernize your existing site while preserving your SEO rankings and brand identity. We\'ll analyze your current site and recommend the best approach.',
'بالتأكيد! نحن متخصصون في إعادة تصميم المواقع ويمكننا المساعدة في تحديث موقعك الحالي مع الحفاظ على تصنيفات SEO وهويتك البصرية. سنحلل موقعك الحالي ونوصي بأفضل نهج.',
5, true);


-- ==================== PARTNERS / CLIENTS ====================

INSERT INTO `Partner` (`id`, `name`, `nameAr`, `logo`, `website`, `description`, `type`, `featured`, `displayOrder`, `isActive`) VALUES
(UUID(), 'TechCorp', 'تيك كورب', '/images/partners/techcorp.png', 'https://techcorp.com', 'Leading technology solutions provider', 'client', true, 1, true),
(UUID(), 'HealthTech Pro', 'هيلث تك برو', '/images/partners/healthtech.png', 'https://healthtechpro.com', 'Healthcare technology innovator', 'client', true, 2, true),
(UUID(), 'Creative Studios', 'كرييتف ستوديوز', '/images/partners/creative.png', 'https://creativestudios.com', 'Award-winning creative agency', 'client', false, 3, true),
(UUID(), 'E-Commerce Giant', 'إي كومرس جاينت', '/images/partners/ecommerce.png', 'https://ecommercegiant.com', 'Major e-commerce platform', 'client', true, 4, true),
(UUID(), 'AWS', 'أمازون ويب سيرفيسز', '/images/partners/aws.png', 'https://aws.amazon.com', 'Cloud infrastructure partner', 'technology', true, 5, true),
(UUID(), 'Vercel', 'فيرسل', '/images/partners/vercel.png', 'https://vercel.com', 'Frontend deployment platform', 'technology', false, 6, true);


-- ==================== MENUS ====================

-- Header Menu
INSERT INTO `Menu` (`id`, `name`, `nameAr`, `location`, `isActive`) VALUES
(UUID(), 'Main Navigation', 'القائمة الرئيسية', 'header', true);

SET @header_menu_id = (SELECT id FROM `Menu` WHERE location = 'header' LIMIT 1);

INSERT INTO `MenuItem` (`id`, `menuId`, `label`, `labelAr`, `url`, `displayOrder`, `isActive`) VALUES
(UUID(), @header_menu_id, 'Home', 'الرئيسية', '/', 1, true),
(UUID(), @header_menu_id, 'Services', 'الخدمات', '/services', 2, true),
(UUID(), @header_menu_id, 'Portfolio', 'أعمالنا', '/portfolio', 3, true),
(UUID(), @header_menu_id, 'About', 'من نحن', '/about', 4, true),
(UUID(), @header_menu_id, 'Blog', 'المدونة', '/blog', 5, true),
(UUID(), @header_menu_id, 'Contact', 'اتصل بنا', '/contact', 6, true);

-- Footer Menu
INSERT INTO `Menu` (`id`, `name`, `nameAr`, `location`, `isActive`) VALUES
(UUID(), 'Footer Navigation', 'قائمة الفوتر', 'footer', true);

SET @footer_menu_id = (SELECT id FROM `Menu` WHERE location = 'footer' LIMIT 1);

INSERT INTO `MenuItem` (`id`, `menuId`, `label`, `labelAr`, `url`, `displayOrder`, `isActive`) VALUES
(UUID(), @footer_menu_id, 'Privacy Policy', 'سياسة الخصوصية', '/privacy', 1, true),
(UUID(), @footer_menu_id, 'Terms of Service', 'شروط الخدمة', '/terms', 2, true),
(UUID(), @footer_menu_id, 'Careers', 'الوظائف', '/careers', 3, true),
(UUID(), @footer_menu_id, 'FAQ', 'الأسئلة الشائعة', '/faq', 4, true);


-- ==================== PAGES ====================

INSERT INTO `Page` (`id`, `title`, `titleAr`, `slug`, `content`, `contentAr`, `metaTitle`, `metaDesc`, `template`, `status`, `displayOrder`) VALUES
(UUID(), 'Privacy Policy', 'سياسة الخصوصية', 'privacy',
'<h1>Privacy Policy</h1><p>Last updated: January 2024</p><h2>Information We Collect</h2><p>We collect information you provide directly to us, such as when you fill out a contact form, subscribe to our newsletter, or communicate with us.</p><h2>How We Use Your Information</h2><p>We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with legal obligations.</p>',
'<h1>سياسة الخصوصية</h1><p>آخر تحديث: يناير 2024</p><h2>المعلومات التي نجمعها</h2><p>نجمع المعلومات التي تقدمها لنا مباشرة، مثل عندما تملأ نموذج اتصال أو تشترك في نشرتنا الإخبارية أو تتواصل معنا.</p>',
'Privacy Policy | Lumina Agency',
'Our privacy policy explains how we collect, use, and protect your information.',
'default', 'published', 1),

(UUID(), 'Terms of Service', 'شروط الخدمة', 'terms',
'<h1>Terms of Service</h1><p>Last updated: January 2024</p><h2>Acceptance of Terms</h2><p>By accessing or using our services, you agree to be bound by these Terms of Service.</p><h2>Use of Services</h2><p>You may use our services only in compliance with these Terms and all applicable laws and regulations.</p>',
'<h1>شروط الخدمة</h1><p>آخر تحديث: يناير 2024</p><h2>قبول الشروط</h2><p>من خلال الوصول إلى خدماتنا أو استخدامها، فإنك توافق على الالتزام بشروط الخدمة هذه.</p>',
'Terms of Service | Lumina Agency',
'Read our terms of service to understand the rules and guidelines for using our services.',
'default', 'published', 2);


-- ==================== SITE STATS ====================

INSERT INTO `SiteStat` (`id`, `key`, `value`) VALUES
(UUID(), 'total_projects', 150),
(UUID(), 'happy_clients', 200),
(UUID(), 'team_members', 25),
(UUID(), 'years_experience', 8),
(UUID(), 'page_views', 0),
(UUID(), 'contact_submissions', 0);


SELECT '✅ All seed data inserted successfully!' AS status;
