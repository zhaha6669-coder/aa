-- Seed Data for Lumina Agency
-- This script adds sample data to the database

SET NAMES utf8mb4;

-- ==================== SAMPLE SERVICES ====================

INSERT INTO `Service` (`id`, `title`, `titleAr`, `slug`, `shortDescription`, `shortDescAr`, `fullDescription`, `fullDescAr`, `icon`, `features`, `featuresAr`, `displayOrder`, `isActive`, `createdAt`, `updatedAt`) VALUES
('svc-web', 'Web Development', 'تطوير المواقع', 'web-development', 'Custom websites and web applications built with modern technologies', 'مواقع وتطبيقات ويب مخصصة مبنية بأحدث التقنيات', 'We create stunning, high-performance websites that drive results. From simple landing pages to complex web applications, our team delivers solutions that exceed expectations.', 'نقوم بإنشاء مواقع ويب مذهلة وعالية الأداء تحقق النتائج. من صفحات الهبوط البسيطة إلى تطبيقات الويب المعقدة، يقدم فريقنا حلولاً تفوق التوقعات.', 'globe', '["Responsive Design", "SEO Optimization", "Fast Loading", "Security"]', '["تصميم متجاوب", "تحسين محركات البحث", "تحميل سريع", "أمان"]', 1, true, NOW(), NOW()),
('svc-mobile', 'Mobile Apps', 'تطبيقات الجوال', 'mobile-apps', 'Native and cross-platform mobile applications', 'تطبيقات جوال أصلية ومتعددة المنصات', 'Build powerful mobile experiences for iOS and Android. We use React Native and Flutter to create apps that feel native while sharing code across platforms.', 'أنشئ تجارب جوال قوية لنظامي iOS و Android. نستخدم React Native و Flutter لإنشاء تطبيقات تبدو أصلية مع مشاركة الكود عبر المنصات.', 'smartphone', '["iOS & Android", "Cross-platform", "Push Notifications", "Offline Support"]', '["iOS و Android", "متعدد المنصات", "إشعارات فورية", "دعم بدون إنترنت"]', 2, true, NOW(), NOW()),
('svc-uiux', 'UI/UX Design', 'تصميم واجهات المستخدم', 'ui-ux-design', 'Beautiful and intuitive user interface designs', 'تصاميم واجهات مستخدم جميلة وسهلة الاستخدام', 'Create memorable user experiences with our design expertise. We focus on usability, accessibility, and visual appeal to ensure your product stands out.', 'أنشئ تجارب مستخدم لا تُنسى بخبرتنا في التصميم. نركز على سهولة الاستخدام وإمكانية الوصول والجاذبية البصرية لضمان تميز منتجك.', 'palette', '["User Research", "Wireframing", "Prototyping", "Design Systems"]', '["بحث المستخدم", "الإطارات السلكية", "النماذج الأولية", "أنظمة التصميم"]', 3, true, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updatedAt` = NOW();

-- ==================== SAMPLE TESTIMONIALS ====================

INSERT INTO `Testimonial` (`id`, `quote`, `quoteAr`, `authorName`, `authorRole`, `authorRoleAr`, `authorCompany`, `rating`, `featured`, `approved`, `displayOrder`, `createdAt`, `updatedAt`) VALUES
('test-1', 'Lumina transformed our online presence completely. Their team delivered beyond our expectations with a stunning website that increased our conversions by 200%.', 'قامت Lumina بتحويل تواجدنا على الإنترنت بشكل كامل. قدم فريقهم أكثر مما توقعنا بموقع مذهل زاد من تحويلاتنا بنسبة 200%.', 'Ahmed Al-Rashid', 'CEO', 'المدير التنفيذي', 'TechStart Iraq', 5, true, true, 1, NOW(), NOW()),
('test-2', 'Working with Lumina was a fantastic experience. They understood our vision and created an app that our users love. Highly recommended!', 'كان العمل مع Lumina تجربة رائعة. فهموا رؤيتنا وأنشأوا تطبيقاً يحبه مستخدمونا. أنصح بهم بشدة!', 'Sarah Johnson', 'Founder', 'المؤسس', 'StyleHub', 5, true, true, 2, NOW(), NOW()),
('test-3', 'Professional, creative, and dedicated. Lumina delivered our e-commerce platform on time and within budget. Our sales have doubled since launch.', 'محترفون ومبدعون ومتفانون. قدمت Lumina منصة التجارة الإلكترونية الخاصة بنا في الوقت المحدد وضمن الميزانية. تضاعفت مبيعاتنا منذ الإطلاق.', 'Mohammed Hassan', 'Owner', 'المالك', 'Hassan Electronics', 5, true, true, 3, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updatedAt` = NOW();

-- ==================== SAMPLE PROJECTS ====================

INSERT INTO `Project` (`id`, `title`, `titleAr`, `slug`, `description`, `descriptionAr`, `category`, `technologies`, `clientName`, `featured`, `status`, `displayOrder`, `createdAt`, `updatedAt`) VALUES
('proj-1', 'E-Commerce Platform', 'منصة تجارة إلكترونية', 'ecommerce-platform', 'A full-featured e-commerce platform with inventory management, payment processing, and analytics dashboard.', 'منصة تجارة إلكترونية متكاملة مع إدارة المخزون ومعالجة الدفع ولوحة تحليلات.', 'Web', '["Next.js", "TypeScript", "Prisma", "Stripe"]', 'Hassan Electronics', true, 'published', 1, NOW(), NOW()),
('proj-2', 'Fitness Tracking App', 'تطبيق تتبع اللياقة', 'fitness-app', 'Cross-platform mobile app for tracking workouts, nutrition, and health metrics with social features.', 'تطبيق جوال متعدد المنصات لتتبع التمارين والتغذية والمقاييس الصحية مع ميزات اجتماعية.', 'Mobile', '["React Native", "Node.js", "MongoDB", "Firebase"]', 'FitLife', true, 'published', 2, NOW(), NOW()),
('proj-3', 'SaaS Dashboard', 'لوحة تحكم SaaS', 'saas-dashboard', 'Modern analytics dashboard for a SaaS product with real-time data visualization and team collaboration.', 'لوحة تحليلات حديثة لمنتج SaaS مع تصور البيانات في الوقت الفعلي والتعاون الجماعي.', 'SaaS', '["React", "D3.js", "GraphQL", "PostgreSQL"]', 'DataFlow Inc', true, 'published', 3, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updatedAt` = NOW();

-- ==================== SAMPLE TEAM MEMBERS ====================

INSERT INTO `TeamMember` (`id`, `name`, `nameAr`, `role`, `roleAr`, `bio`, `bioAr`, `displayOrder`, `isActive`, `createdAt`, `updatedAt`) VALUES
('team-1', 'Ali Hassan', 'علي حسن', 'Founder & CEO', 'المؤسس والمدير التنفيذي', 'Visionary leader with 10+ years of experience in digital transformation.', 'قائد صاحب رؤية بخبرة أكثر من 10 سنوات في التحول الرقمي.', 1, true, NOW(), NOW()),
('team-2', 'Noor Ahmed', 'نور أحمد', 'Lead Developer', 'كبير المطورين', 'Full-stack developer passionate about clean code and scalable architectures.', 'مطور متكامل شغوف بالكود النظيف والبنيات القابلة للتوسع.', 2, true, NOW(), NOW()),
('team-3', 'Layla Mahmoud', 'ليلى محمود', 'UI/UX Designer', 'مصممة واجهات المستخدم', 'Creative designer focused on crafting delightful user experiences.', 'مصممة مبدعة تركز على صياغة تجارب مستخدم ممتعة.', 3, true, NOW(), NOW())
ON DUPLICATE KEY UPDATE `updatedAt` = NOW();

SELECT 'Seed data inserted successfully!' AS status;
