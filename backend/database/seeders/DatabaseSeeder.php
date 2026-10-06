<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\{DB,Hash};
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $defaultAdmins = [
            ['name' => 'faseed', 'email' => 'faseed@simatrixacademy.com', 'password' => 'faseedsimatrix@2026', 'role' => 'super_admin'],
            ['name' => 'Sakthi', 'email' => 'sakthi@simatrixacademy.com', 'password' => 'sakthisimatrix@2026', 'role' => 'admin'],
            ['name' => 'Mathi', 'email' => 'mathi@simatrixacademy.com', 'password' => 'mathisimatrix@2026', 'role' => 'admin'],
        ];
        foreach ($defaultAdmins as $u) {
            DB::table('admins')->updateOrInsert(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'password_hash' => Hash::make($u['password']),
                    'role' => $u['role'],
                    'created_at' => now(),
                ]
            );
        }
        $features = [
            ['Comprehensive Curriculum','Industry-aligned syllabus covering fundamentals to advanced topics.','book'],
            ['Real-World Projects','Hands-on projects that mirror the work you will do on the job.','code'],
            ['Personalized Learning Paths','Flexible tracks tailored to your goals and skill level.','route'],
            ['Dedicated Support Team','Mentors and trainers available throughout your learning journey.','support'],
            ['Job Placement Assistance','Resume building, mock interviews and placement drives.','briefcase'],
        ];
        foreach ($features as $i=>$f) DB::table('features')->updateOrInsert(['title'=>$f[0]],['description'=>$f[1],'icon'=>$f[2],'order'=>$i]);
        $courseImages = [
            'MERN Full Stack' => '/courses2/mern-full-stack.jpeg',
            'MEAN Full Stack' => '/courses2/mean-full-stack.jpeg',
            'Python Full Stack' => '/courses2/python-full-stack.jpeg',
            'Java Full Stack' => '/courses2/java-full-stack.jpeg',
            'Data Science with Python' => '/courses2/ai-machine-learning.jpeg',
            'Machine Learning' => '/courses2/ai-machine-learning.jpeg',
            'Data Analytics' => '/courses2/data-analytics.jpeg',
            'DevOps' => '/courses2/cloud-devops.jpeg',
            'AWS Solutions Architect' => '/courses2/cloud-devops.jpeg',
            'Digital Marketing' => '/courses2/data-analytics.jpeg',
            'Flutter Development' => '/courses2/mern-full-stack.jpeg',
            'Android Development' => '/courses2/mern-full-stack.jpeg',
        ];

        $catalog = [
            'full-stack'=>['Full Stack Development','layers',['MERN Full Stack','MEAN Full Stack','Python Full Stack','Java Full Stack']],
            'data-science'=>['Data Science & AI','chart',['Data Science with Python','Machine Learning','Data Analytics']],
            'programming'=>['Programming Languages','code',['Java Programming','Python Programming','C & C++ Programming','PHP Development','.NET Development']],
            'mobile-app'=>['Mobile App Development','smartphone',['Android Development','iOS Development','Flutter Development','React Native']],
            'cybersecurity'=>['Cybersecurity & Networking','shield',['CCNA Certification','CCNP Certification','Ethical Hacking','CompTIA Security+']],
            'database'=>['Database Management','database',['MySQL','Oracle Database','Microsoft SQL Server']],
            'cloud'=>['Cloud Computing','cloud',['AWS Solutions Architect','Microsoft Azure','Google Cloud Platform','DevOps']],
            'sap'=>['SAP Modules','boxes',['SAP FICO','SAP MM','SAP ABAP']],
            'testing'=>['Software Testing','check',['Manual Testing','Selenium Automation','API Testing']],
            'digital-marketing'=>['Digital Marketing','megaphone',['Digital Marketing']],
        ];
        $catOrder=0;
        foreach ($catalog as $slug=>$cat) {
            DB::table('course_categories')->updateOrInsert(['slug'=>$slug],['name'=>$cat[0],'icon'=>$cat[1],'description'=>'Industry-focused '.$cat[0].' courses.','order'=>$catOrder++]);
            $categoryId=DB::table('course_categories')->where('slug',$slug)->value('id');
            foreach ($cat[2] as $i=>$title) {
                $content = $this->courseContent($title, $slug);
                $courseImg = $courseImages[$title] ?? '/courses2/mern-full-stack.jpeg';
                DB::table('courses')->updateOrInsert(['slug'=>Str::slug($title)],[
                    'category_id'=>$categoryId,'title'=>$title,
                    'image'=>$courseImg,
                    'summary'=>'Hands-on '.$title.' training with guided labs and industry-oriented projects.',
                    'description'=>'Build practical '.$title.' skills from core concepts through advanced workflows, testing, deployment, portfolio projects, and interview preparation.',
                    'duration'=>'3 Months','level'=>'Beginner to Advanced','tier'=>'classic',
                    'syllabus'=>json_encode($content['syllabus']),
                    'roadmap'=>json_encode($content['roadmap']),
                    'designations'=>json_encode($content['designations']),
                    'quiz'=>json_encode($content['quiz']),
                    'is_active'=>1,'order'=>$i,
                ]);
            }
        }
        DB::table('branches')->updateOrInsert(['name'=>'Virudhunagar (Head Office)'],['city'=>'Virudhunagar','address'=>'1/2A, 1st Floor, AA Road, Near Head Post Office, Virudhunagar – 626001, Tamil Nadu','phone'=>'+91 93637 93954','email'=>'info@simatrixacademy.com','hours'=>'Mon-Sat: 9 AM - 7 PM','is_primary'=>1,'order'=>0]);
        $reviews=[['Priya R.','MERN Full Stack Graduate','The hands-on projects and mentor support made all the difference.'],['Karthik S.','Data Science Student','Trainers explain complex topics simply and the placement team genuinely cares.'],['Divya M.','CCNA Certified','Great lab access and real equipment practice.']];
        foreach($reviews as $i=>$r) DB::table('testimonials')->updateOrInsert(['name'=>$r[0]],['role'=>$r[1],'content'=>$r[2],'rating'=>5,'is_active'=>1,'order'=>$i]);
        $settings=['contact_phone'=>'+91 93637 93954','contact_phone2'=>'+91 93637 93954','contact_email'=>'info@simatrixacademy.com','contact_address'=>'1/2A, 1st Floor, AA Road, Near Head Post Office, Virudhunagar – 626001','whatsapp'=>'919363793954','hero_slides'=>'[]'];
        foreach($settings as $key=>$value) DB::table('settings')->updateOrInsert(['key'=>$key],['value'=>$value]);
    }

    private function courseContent(string $title, string $category): array
    {
        $topics = [
            'programming'=>['language syntax, variables, operators, and control flow','functions, reusable modules, and clean-code conventions','object-oriented design, classes, interfaces, and composition','collections, file handling, exceptions, and debugging','database connectivity, APIs, testing, performance, and secure coding'],
            'full-stack'=>['semantic HTML, responsive CSS, JavaScript, and browser fundamentals','component-based frontend architecture, state, forms, and routing','server-side programming, REST APIs, validation, and authentication','relational and document databases, data modelling, queries, and migrations','testing, Git workflows, cloud deployment, monitoring, and a production capstone'],
            'mobile-app'=>['language fundamentals, SDK setup, project structure, and developer tooling','responsive mobile interfaces, navigation, accessibility, and platform conventions','application state, local persistence, forms, validation, and device capabilities','REST APIs, authentication, notifications, background work, and error handling','testing, performance, security, store publishing, and a portfolio application'],
            'cybersecurity'=>['network models, addressing, protocols, devices, and command-line foundations','routing, switching, traffic analysis, system hardening, and access control','threat modelling, vulnerability assessment, secure configuration, and incident response','identity, cryptography, firewalls, monitoring, evidence handling, and risk management','guided labs, troubleshooting, reporting, certification practice, and an enterprise scenario'],
            'database'=>['relational concepts, schemas, data types, constraints, and normalization','SQL queries, filtering, joins, grouping, subqueries, and set operations','views, procedures, functions, triggers, transactions, and concurrency','indexes, execution plans, performance tuning, security, backup, and recovery','administration labs, reporting, application integration, and a database capstone'],
            'data-science'=>['Python, spreadsheets, statistics, data types, and analytical problem framing','data collection, cleaning, transformation, exploration, and feature preparation','visualization, dashboards, probability, hypothesis testing, and business storytelling','regression, classification, clustering, model evaluation, and responsible AI','end-to-end projects, deployment, monitoring, portfolio presentation, and interviews'],
            'cloud'=>['cloud service models, global infrastructure, identity, billing, and shared responsibility','compute, storage, networking, load balancing, DNS, and scalable architecture','managed databases, containers, serverless workloads, messaging, and automation','security, observability, reliability, backup, disaster recovery, and cost optimization','infrastructure as code, CI/CD, hands-on labs, architecture case study, and certification review'],
            'sap'=>['enterprise processes, SAP architecture, navigation, master data, and organizational structures','configuration fundamentals, transactions, document flow, reporting, and integration points','module-specific business scenarios, validation, authorizations, and data migration','testing, debugging, transport management, performance, and support operations','guided implementation, documentation, interview scenarios, and an end-to-end project'],
            'testing'=>['software quality fundamentals, SDLC, STLC, requirements, and testing strategy','test scenarios, test cases, test data, traceability, execution, and defect reporting','functional, integration, regression, usability, compatibility, and exploratory testing','automation design, API validation, frameworks, version control, and continuous testing','real application testing, metrics, reporting, portfolio evidence, and interviews'],
            'digital-marketing'=>['marketing fundamentals, audience research, positioning, funnels, and campaign planning','SEO, keyword research, content strategy, websites, and conversion optimization','paid search, display advertising, social media, email, and marketing automation','analytics, attribution, experimentation, budgets, reporting, privacy, and brand safety','integrated campaign project, portfolio creation, client communication, and career preparation'],
        ][$category];

        $syllabus = [
            "Module 1 — {$title} orientation: understand the ecosystem, common use cases, career paths, tools, installation, and a professional development workflow.",
            "Module 2 — Foundations: master {$topics[0]} through demonstrations, guided exercises, checkpoints, and a small practical assignment.",
            "Module 3 — Core implementation: practise {$topics[1]} while learning naming standards, documentation, collaboration, and maintainable solution structure.",
            "Module 4 — Applied concepts: build confidence with {$topics[2]} using scenario-based labs and instructor-led troubleshooting.",
            "Module 5 — Data and integration: explore {$topics[3]} with realistic datasets, external systems, validation rules, and failure recovery.",
            "Module 6 — Advanced workflows: apply {$topics[4]} and compare alternative designs, trade-offs, limitations, and industry best practices.",
            "Module 7 — Quality engineering: plan tests, diagnose defects, review work, improve performance, handle edge cases, and document technical decisions.",
            "Module 8 — Security and production readiness: protect sensitive data, manage permissions, configure environments, create backups, and monitor reliability.",
            "Module 9 — Guided industry project: analyse requirements, design the solution, implement milestones, use Git, test outcomes, and present a working demonstration.",
            "Module 10 — Capstone and career preparation: independently deliver a portfolio project, prepare documentation, review interview questions, and create a personal upskilling plan.",
        ];
        $roadmap = [
            "Weeks 1–2: Set up the {$title} environment, learn essential terminology, complete baseline exercises, and establish a consistent practice routine.",
            "Weeks 3–4: Strengthen fundamentals through daily labs, concept checks, debugging practice, and a mentor-reviewed mini assignment.",
            "Weeks 5–6: Combine core concepts into small working solutions and learn to explain the reasoning behind each design decision.",
            "Weeks 7–8: Work with realistic data, integrations, security constraints, and error scenarios while following professional standards.",
            "Weeks 9–10: Study advanced techniques, testing, performance, deployment, and collaborative Git-based workflows.",
            "Weeks 11–12: Plan and implement an industry-style guided project with requirements, milestones, reviews, and final documentation.",
            "Portfolio milestone: refine the project, publish evidence of your work, write a strong case study, and practise presenting it clearly.",
            "Career milestone: complete mock assessments and interviews, identify remaining skill gaps, and follow a role-specific continued-learning plan.",
        ];
        $roles = [
            'programming'=>['Junior Software Developer','Application Developer','Backend Developer','Software Support Engineer'],
            'full-stack'=>['Full Stack Developer','Frontend Developer','Backend Developer','Web Application Developer'],
            'mobile-app'=>['Mobile Application Developer','Android/iOS Developer','Cross-Platform Developer','Mobile UI Developer'],
            'cybersecurity'=>['Network Support Engineer','Security Operations Analyst','Junior Penetration Tester','Information Security Associate'],
            'database'=>['SQL Developer','Database Administrator','Database Support Engineer','Data Operations Associate'],
            'data-science'=>['Data Analyst','Junior Data Scientist','Business Intelligence Analyst','Machine Learning Associate'],
            'cloud'=>['Cloud Support Associate','Cloud Engineer','DevOps Associate','Infrastructure Engineer'],
            'sap'=>['SAP Functional Consultant','SAP Technical Consultant','ERP Support Analyst','SAP End User Specialist'],
            'testing'=>['QA Engineer','Manual Test Engineer','Automation Test Engineer','API Test Engineer'],
            'digital-marketing'=>['Digital Marketing Executive','SEO Specialist','Performance Marketing Associate','Social Media Strategist'],
        ][$category];
        $quiz = [
            ['question'=>"What should you do first when starting a professional {$title} project?",'options'=>['Start implementation without requirements','Clarify requirements and expected outcomes','Ignore the development environment','Skip planning and testing'],'answer'=>1],
            ['question'=>"Which practice most improves the maintainability of {$title} work?",'options'=>['Meaningful structure and documentation','Duplicating the same solution','Hiding errors','Avoiding version control'],'answer'=>0],
            ['question'=>"Why are practical projects important when learning {$title}?",'options'=>['They remove the need for fundamentals','They connect concepts to realistic problem solving','They guarantee employment','They make testing unnecessary'],'answer'=>1],
            ['question'=>"What is the best response when a {$title} solution fails a test?",'options'=>['Deploy it unchanged','Delete the test','Diagnose the cause, correct it, and retest','Hide the failure'],'answer'=>2],
            ['question'=>"What demonstrates job-ready {$title} learning most effectively?",'options'=>['Only a course title','A tested project with clear documentation and explanation','Unverified copied work','Memorizing definitions without practice'],'answer'=>1],
        ];
        return compact('syllabus','roadmap','quiz') + ['designations'=>$roles];
    }
}
