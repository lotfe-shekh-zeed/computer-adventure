(function(){
  "use strict";

  var AVATARS = ["🤖","🧑‍🚀","🧑‍💻","🦸","🧑‍🔬","🎮"];
  var currentLang = "ar";
  var i18nData = {};

  /* بيانات الأسئلة والمراحل بجميع اللغات (مع تصحيح العبرية بالكامل) */
  var LEVELS_DATA = {
    ar: [
      {
        id:1, title:"مكوّنات الحاسوب", icon:"🖥️", desc:"تعرّف على أجزاء الحاسوب الأساسية",
        questions:[
          {q:"أي من هذه الأجزاء يُعتبر «عقل» الحاسوب الذي يُنفّذ العمليات؟", options:["المعالج (CPU)","الفأرة","السماعة","الطابعة"], correct:0, explain:"المعالج هو الجزء المسؤول عن تنفيذ العمليات وتشغيل كل شيء داخل الحاسوب."},
          {q:"ما الجهاز الذي نستخدمه للكتابة على الحاسوب؟", options:["الطابعة","لوحة المفاتيح","الميكروفون","السماعة"], correct:1, explain:"لوحة المفاتيح (Keyboard) هي أداة إدخال النصوص والأوامر."},
          {q:"أين تُخزَّن الملفات بشكل دائم حتى بعد إغلاق الجهاز؟", options:["الذاكرة العشوائية RAM","الشاشة","القرص الصلب (Hard Disk)","الفأرة"], correct:2, explain:"القرص الصلب يحفظ الملفات بشكل دائم، بعكس الذاكرة العشوائية التي تُمسح عند إغلاق الجهاز."},
          {q:"ما وظيفة الفأرة (Mouse) في الحاسوب؟", options:["تخزين الملفات","تشغيل الصوت","التحكم بالمؤشر واختيار العناصر","طباعة الأوراق"], correct:2, explain:"الفأرة تساعدنا على تحريك المؤشر والنقر على العناصر على الشاشة."},
          {q:"أي جهاز يُستخدم لإخراج الأوراق المطبوعة؟", options:["الماسح الضوئي","السماعة","الشاشة","الطابعة"], correct:3, explain:"الطابعة (Printer) تحوّل الملفات الرقمية إلى أوراق مطبوعة."}
        ]
      },
      {
        id:2, title:"البرمجيات ونظام التشغيل", icon:"💾", desc:"افهم الفرق بين البرامج والأجهزة",
        questions:[
          {q:"ما هو نظام التشغيل؟", options:["برنامج يدير عمل الحاسوب ويُشغّل باقي البرامج","لعبة إلكترونية فقط","جهاز لتخزين الصور","نوع من الطابعات"], correct:0, explain:"نظام التشغيل هو البرنامج الرئيسي الذي يدير كل شيء في الحاسوب ويسمح للبرامج الأخرى بالعمل."},
          {q:"أي مما يلي يُعتبر نظام تشغيل؟", options:["Word","Windows","PowerPoint","Chrome"], correct:1, explain:"Windows هو نظام تشغيل، بينما البقية برامج تعمل فوق نظام التشغيل."},
          {q:"ما الفرق الصحيح بين البرنامج (Software) والجهاز (Hardware)؟", options:["لا فرق بينهما أبدًا","Hardware هو نفسه البرامج","Software غير ملموس ويُدار بالبرمجة، وHardware أجزاء مادية ملموسة","كلاهما نفس الشيء دائمًا"], correct:2, explain:"البرمجيات أكواد وبرامج غير ملموسة، بينما الأجهزة (Hardware) قطع مادية يمكن لمسها."},
          {q:"ما اسم البرنامج الذي نستخدمه عادةً لكتابة المستندات؟", options:["مشغّل الفيديو","متصفح الإنترنت","معالج النصوص مثل Word","برنامج الرسام فقط"], correct:2, explain:"معالج النصوص مثل Word مخصص لكتابة وتنسيق المستندات."},
          {q:"ما هو التطبيق (App)؟", options:["جزء من الفأرة","برنامج مصمم لأداء مهمة معينة على الجهاز","قطعة داخل المعالج","نوع من الكابلات"], correct:1, explain:"التطبيق برنامج صُمم لأداء وظيفة محددة، مثل تطبيق للرسم أو الألعاب أو التعلم."}
        ]
      },
      {
        id:3, title:"الإنترنت والأمان الرقمي", icon:"🌐", desc:"تعلّم كيف تحمي نفسك على الإنترنت",
        questions:[
          {q:"ماذا نسمي الكلمة السرية التي تحمي حسابك؟", options:["اسم المستخدم","البريد الإلكتروني","كلمة المرور (Password)","الرابط"], correct:2, explain:"كلمة المرور هي مفتاح سري يجب ألا يعرفه أحد غيرك."},
          {q:"إذا أرسل لك شخص غريب رابطًا لا تعرفه، ماذا يجب أن تفعل؟", options:["تفتحه فورًا لتعرف ما هو","لا تفتحه وتخبر أحد الوالدين أو المعلم","ترسله لكل أصدقائك","تُدخل بياناتك فيه"], correct:1, explain:"الروابط غير المعروفة قد تكون خطيرة، والأصح دائمًا هو عدم فتحها وإخبار شخص تثق به."},
          {q:"أي من هذه تُعتبر «معلومات شخصية» يجب عدم مشاركتها مع الغرباء؟", options:["لونك المفضل","اسمك الكامل وعنوانك ورقم هاتفك","اسم لعبتك المفضلة","حالة الطقس"], correct:1, explain:"المعلومات الشخصية كالاسم الكامل والعنوان ورقم الهاتف يجب أن تبقى سرية وخاصة."},
          {q:"ما أفضل وصف لكلمة مرور قوية؟", options:["الرقم 1234","اسمك فقط","تاريخ ميلادك فقط","مزيج من حروف وأرقام ورموز يصعب تخمينه"], correct:3, explain:"كلمة المرور القوية تجمع بين حروف كبيرة وصغيرة وأرقام ورموز، ويصعب على الآخرين تخمينها."},
          {q:"ماذا تفعل إذا شعرت بالإزعاج من رسائل شخص على الإنترنت؟", options:["تتجاهل الأمر وتستمر بالتحدث معه","تخبر أحد الوالدين أو شخصًا تثق به فورًا","تحذفه فقط دون إخبار أحد","تردّ عليه بنفس الطريقة"], correct:1, explain:"إخبار شخص بالغ تثق به هو الخطوة الصحيحة دائمًا عند الشعور بالإزعاج أو الخطر."}
        ]
      },
      {
        id:4, title:"التقنية والصحة والحياة", icon:"⚖️", desc:"وازن بين استخدام التقنية وحياتك اليومية",
        questions:[
          {q:"ما الوقت المناسب لأخذ استراحة أثناء استخدام الشاشة لإراحة عينيك؟", options:["بعد 5 ساعات متواصلة","كل 20-30 دقيقة تقريبًا","لا داعي لأخذ استراحة أبدًا","فقط عند الشعور بألم شديد"], correct:1, explain:"يُنصح بأخذ استراحة قصيرة كل 20-30 دقيقة لإراحة العينين والجسم."},
          {q:"أي من هذه الأنشطة يساعد على التوازن بين التقنية والحياة؟", options:["البقاء أمام الشاشة طوال اليوم","تجاهل الواجبات المدرسية","اللعب في الهواء الطلق والقراءة والتحدث مع العائلة","النوم متأخرًا بسبب الألعاب"], correct:2, explain:"الأنشطة المتنوعة كاللعب بالخارج والقراءة والوقت مع العائلة تصنع توازنًا صحيًا مع استخدام التقنية."},
          {q:"لماذا يُفضَّل عدم استخدام الجهاز قبل النوم مباشرة؟", options:["لأنه يجعل الجهاز ساخنًا فقط","لأن ضوء الشاشة يؤثر على جودة النوم","لا يوجد سبب حقيقي","لأنه يستهلك بطارية الجهاز فقط"], correct:1, explain:"ضوء الشاشات يؤثر على هرمونات النوم، لذا يُفضَّل تركها قبل النوم بوقت كافٍ."},
          {q:"ما الفرق بين استخدام التقنية للتعلّم واستخدامها للتسلية المفرطة طوال الوقت؟", options:["لا فرق بينهما إطلاقًا","التعلّم يطوّر المهارات، والإفراط بالتسلية يقلّل وقت الأنشطة المهمة الأخرى","التسلية دائمًا أفضل من التعلّم","التعلّم مضيعة للوقت"], correct:1, explain:"استخدام التقنية للتعلّم يبني مهارات مفيدة، أما الإفراط في التسلية فقد يأخذ وقتًا من أنشطة مهمة أخرى."},
          {q:"ما العادة الصحية الجيدة عند الجلوس أمام الحاسوب؟", options:["الاقتراب جدًا من الشاشة","الجلوس بوضعية مستقيمة والحفاظ على مسافة مناسبة عن الشاشة","وضع الجهاز على الركبتين لساعات طويلة","الجلوس منحنيًا بأي شكل"], correct:1, explain:"الجلوس بشكل صحيح والمسافة المناسبة عن الشاشة يحميان ظهرك وعينيك."}
        ]
      },
      {
        id:5, title:"مراجعة شاملة وتحدي القمة", icon:"🏆", desc:"اختبر كل ما تعلمته في تحدٍّ نهائي",
        questions:[
          {q:"أي جزء من الحاسوب يُخزّن المعلومات مؤقتًا أثناء التشغيل فقط؟", options:["القرص الصلب","الذاكرة العشوائية RAM","الطابعة","الفأرة"], correct:1, explain:"الذاكرة العشوائية RAM تخزن البيانات مؤقتًا أثناء التشغيل، وتُمسح عند إغلاق الجهاز."},
          {q:"ما اسم الشبكة العالمية التي تربط ملايين الأجهزة ببعضها؟", options:["المعالج","الإنترنت","لوحة المفاتيح","الشاشة"], correct:1, explain:"الإنترنت شبكة عالمية تربط ملايين الأجهزة حول العالم لتبادل المعلومات."},
          {q:"ماذا يجب أن تتضمّن كلمة المرور الجيدة عند إنشاء بريد إلكتروني جديد؟", options:["اسمك فقط","الرقم 0000","حروف كبيرة وصغيرة وأرقام ورموز","تاريخ ميلادك فقط"], correct:2, explain:"كلمة المرور القوية تجمع عدة أنواع من الرموز لتكون صعبة التخمين."},
          {q:"ما الهدف من «التوازن الرقمي» (Digital Balance)؟", options:["استخدام الجهاز طوال اليوم بدون توقف","استخدام التقنية بشكل مفيد دون التأثير على الصحة والحياة الاجتماعية","تجنّب استخدام التقنية نهائيًا","اللعب فقط دون تعلّم"], correct:1, explain:"التوازن الرقمي يعني الاستفادة من التقنية دون أن تؤثر سلبًا على صحتك أو علاقاتك."},
          {q:"ما أول شيء ينبغي أن يبدأ به المسلم يومه أو أي عمل مهم؟", options:["فتح الحاسوب مباشرة","ذكر الله والصلاة","مشاهدة التلفاز","تناول الطعام فقط"], correct:1, explain:"البداية بذكر الله والصلاة أساس في حياتنا اليومية، وتأتي قبل كل عمل آخر."}
        ]
      }
    ],
    he: [
      {
        id:1, title:"רכיבי המחשב", icon:"🖥️", desc:"הכירו את חלקי המחשב הבסיסיים",
        questions:[
          {q:"איזה חלק נחשב ל«מוח» של המחשב המבצע את הפעולות?", options:["מעבד (CPU)","עכבר","רמקול","מדפסת"], correct:0, explain:"המעבד אחראי על ביצוע החישובים והפעלת התוכנות במחשב."},
          {q:"באיזה התקן אנו משתמשים כדי להקליד במחשב?", options:["מדפסת","מקלדת","מיקרופון","רמקול"], correct:1, explain:"המקלדת היא הכלי להזנת טקסט ופקודות."},
          {q:"היכן נשמרים הקבצים באופן קבוע גם לאחר כיבוי המחשב?", options:["זיכרון RAM","מסך","כונן קשיח (Hard Disk)","עכבר"], correct:2, explain:"הכונן הקשיח שומר קבצים לצמיתות, בניגוד לזיכרון ה-RAM שנמחק בכיבוי."},
          {q:"מה תפקידו של העכבר במחשב?", options:["אחסון קבצים","השמעת צלילים","שליטה בסמן ובחירת פריטים","הדפסת דפים"], correct:2, explain:"העכבר עוזר לנו להזיז את הסמן וללחוץ על אלמנטים במסך."},
          {q:"איזה מכשיר משמש להוצאת דפים מודפסים?", options:["סורק","רמקול","מסך","מדפסת"], correct:3, explain:"המדפסת הופכת קבצים דיגיטליים לדפים מודפסים."}
        ]
      },
      {
        id:2, title:"תוכנות ומערכת הפעלה", icon:"💾", desc:"הבינו את ההבדל בין תוכנה לחומרה",
        questions:[
          {q:"מהי מערכת הפעלה?", options:["תוכנה המנהלת את המחשב ומפעילה את שאר התוכנות","משחק מחשב בלבד","מכשיר לאחסון תמונות","סוג של מדפסת"], correct:0, explain:"מערכת ההפעלה היא התוכנה הראשית המנהלת את רכיבי המחשב."},
          {q:"איזו מהבאות נחשבת למערכת הפעלה?", options:["Word","Windows","PowerPoint","Chrome"], correct:1, explain:"Windows היא מערכת הפעלה, בעוד השאר הן תוכנות יישומיות."},
          {q:"מה ההבדל הנכון בין תוכנה (Software) לחומרה (Hardware)?", options:["אין שום הבדל","חומרה היא כמו תוכנה","תוכנה אינה מוחשית, וחומרה מורכבת מחלקים פיזיים מוחשיים","שתיהן אותו הדבר"], correct:2, explain:"תוכנה מורכבת מקוד וקבצים, בעוד חומרה היא חלק פיזי שאפשר לגעת בו."},
          {q:"מה שמה של התוכנה המשמשת בדרך כלל לכתיבת מסמכים?", options:["נגן וידאו","דפדפן אינטרנט","מעבד תמלילים כמו Word","תוכנת צייר"], correct:2, explain:"מעבד תמלילים מיועד לעריכה וכתיבה של מסמכים."},
          {q:"מהי אפליקציה (App)?", options:["חלק מהעכבר","תוכנה המיועדת לביצוע משימה מוגדרת במכשיר","רכיב בתוך המעבד","סוג של כבל"], correct:1, explain:"אפליקציה היא תוכנה המיועדת למטרה ספציפית כמו משחק או למידה."}
        ]
      },
      {
        id:3, title:"אינטרנט ואבטחה דיגיטלית", icon:"🌐", desc:"למדו כיצד להגן על עצמכם ברשת",
        questions:[
          {q:"איך נקרא הקוד הסודי המגן על החשבון שלכם?", options:["שם משתמש","דואר אלקטרוני","סיסמה (Password)","קישור"], correct:2, explain:"סיסמה היא מפתח סודי שאין לשתף עם אחרים."},
          {q:"אם אדם זר שולח לכם קישור לא מוכר, מה עליכם לעשות?", options:["לפתוח מיד","לא לפתוח ולדווח להורה או למורה","לשלוח לכל החברים","להזין פרטים אישיים"], correct:1, explain:"קישורים לא מוכרים עלולים להיות מסוכנים; אין לפתוח אותם."},
          {q:"איזה מהבאים נחשב ל«מידע אישי» שאין לשתף עם זרים?", options:["צבע אהוב","שם מלא, כתובת ומספר טלפון","שם של משחק אהוב","מזג האוויר"], correct:1, explain:"פרטים כמו שם מלא, כתובת וטלפון הם מידע פרטי ושמור."},
          {q:"מה מתאר בצורה הטובה ביותר סיסמה חזקה?", options:["המספר 1234","השם שלך בלבד","תאריך הלידה שלך בלבד","שילוב של אותיות, מספרים וסמלים שקשה לנחש"], correct:3, explain:"סיסמה חזקה משלבת אותיות גדולות/קטנות, מספרים וסמלים."},
          {q:"מה לעשות אם מרגישים אי-נוחות מהודעות של מישהו ברשת?", options:["להתעלם ולהמשיך לדבר","לספר מיד להורה או למבוגר שנותנים בו אמון","למחוק מבלי לספר לאיש","לענות באותה צורה"], correct:1, explain:"דיווח למבוגר באחריות הוא הצעד הנכון תמיד."}
        ]
      },
      {
        id:4, title:"טכנולוגיה, בריאות וחיים", icon:"⚖️", desc:"איזון בין שימוש במחשב לחיים היומיומיים",
        questions:[
          {q:"מתי מומלץ לקחת הפסקה מהמסך כדי להקל על העיניים?", options:["לאחר 5 שעות ברציפות","כל 20-30 דקות בערך","אין צורך בהפסקה","רק כשמרגישים כאב חזק"], correct:1, explain:"מומלץ לקחת הפסקה קצרה כל 20-30 דקות למנוחת העיניים."},
          {q:"איזו פעילות מסייעת לשמור על איזון דיגיטלי בריא?", options:["ישיבה מול המסך כל היום","הזנחת שיעורי הבית","משחק באוויר הפתוח, קריאה וזמן איכות עם המשפחה","שינה מאוחרת בגלל משחקים"], correct:2, explain:"פעילויות מגוונות בחוץ ועם המשפחה יוצרות איזון בריא."},
          {q:"מדוע מומלץ להימנע משימוש במסכים ממש לפני השינה?", options:["כי המכשיר מתחמם","כי אור המסך פוגע באיכות השינה","אין סיבה אמיתית","כי זה מגדיל את צריכת הסוללה"], correct:1, explain:"אור המסכים משפיע לרעה على הורמוני השינה."},
          {q:"מה ההבדל بين שימוש בטכנולוגיה ללמידה לבין משחק מופרז בלבד?", options:["אין שום הבדל","למידה מפתחת כישורים, בעוד משחק מופרז פוגע בזמן של פעילויות חשובות","משחק תמיד עדיף","למידה היא בזבוז זמן"], correct:1, explain:"שימוש לימודי מפתח יכולות, בעוד פנאי מופרז גוזל זמן משימות חשובות."},
          {q:"מהי הרגל ישיבה נכון מול המחשב?", options:["להתקרב מאוד למסך","לשבת זקוף ולשמור על מרחק מתאים מהמסך","להניח את המחשב על הברכיים שעות רבות","לשבת כפוף"], correct:1, explain:"ישיבה זקופה במרחק נכון מגנה על הגב והעיניים."}
        ]
      },
      {
        id:5, title:"חזרה כוללת ואתגר השיא", icon:"🏆", desc:"בחנו את כל מה שלמדתם באתגר הסופי",
        questions:[
          {q:"איזה חלק במחשב מאחסן מידע באופן זמני בלבד בזמן העבודה?", options:["כונן קשיח","זיכרון RAM","מדפסת","עכבר"], correct:1, explain:"זיכרון RAM שומר נתונים זמנית בלבד ונמחק בעת כיבוי."},
          {q:"מה שמה של הרשת העולמית המחברת מיליוני מחשבים?", options:["מעבד","אינטרנט","מקלדת","מסך"], correct:1, explain:"האינטרנט הוא רשת גלובלית המחברת מכשירים ברחבי העולם."},
          {q:"מה צריכה להכיל סיסמה טובה ליצירת דוא\"ל חדש?", options:["השם שלך בלבד","המספר 0000","אותיות גדולות וקטנות, מספרים וסמלים","תאריך הלידה בלבד"], correct:2, explain:"סיסמה חזקה כוללת מגוון תווים כדי למנוע ניחוש."},
          {q:"מהי המטרה של «איזון דיגיטלי» (Digital Balance)?", options:["שימוש במחשב כל اليوم ללא הפסקה","שימוש מועיל בטכנולוגיה מבלי לפגוע בבריאות ובחיים החברתיים","הימנעות מוחלטת מטכנולוגיה","משחק בלבד ללא למידה"], correct:1, explain:"איזון דיגיטלי פירושו ניצול הטכנולוגיה באופן בריא ומבוקר."},
          {q:"מה הדבר הראשון שעל אדם מאמין להתחיל בו את יומו?", options:["פתיחת המחשב מיד","תפילה וזכירת ה'","צפייה בטלוויזיה","אכילה בלבד"], correct:1, explain:"תפילה וזכירת ה' הן היסוד ביום-יום לפני كل عمل."}
        ]
      }
    ],
    en: [
      {
        id:1, title:"Computer Components", icon:"🖥️", desc:"Learn basic computer hardware",
        questions:[
          {q:"Which part is considered the 'brain' of the computer that processes data?", options:["Processor (CPU)","Mouse","Speaker","Printer"], correct:0, explain:"The CPU handles all operations and instructions inside the computer."},
          {q:"Which device is used to type text into a computer?", options:["Printer","Keyboard","Microphone","Speaker"], correct:1, explain:"The keyboard is the primary input device for typing text and commands."},
          {q:"Where are files stored permanently even after shutting down?", options:["RAM Memory","Screen","Hard Disk","Mouse"], correct:2, explain:"The Hard Disk saves files permanently, unlike RAM which clears upon shutdown."},
          {q:"What is the function of the Mouse?", options:["Store files","Play sound","Control the cursor and select items","Print papers"], correct:2, explain:"The mouse allows you to point and click elements on the screen."},
          {q:"Which device outputs printed paper documents?", options:["Scanner","Speaker","Monitor","Printer"], correct:3, explain:"The printer transforms digital files into physical printed pages."}
        ]
      },
      {
        id:2, title:"Software & Operating System", icon:"💾", desc:"Understand the difference between software and hardware",
        questions:[
          {q:"What is an Operating System?", options:["Software that manages computer operations and runs apps","Only a game","A photo storage device","A type of printer"], correct:0, explain:"The Operating System manages hardware and allows apps to function."},
          {q:"Which of the following is an Operating System?", options:["Word","Windows","PowerPoint","Chrome"], correct:1, explain:"Windows is an OS, while the others are application software."},
          {q:"What is the main difference between Software and Hardware?", options:["There is no difference","Hardware is software","Software is digital/code, Hardware is physical","Both are identical"], correct:2, explain:"Software consists of non-tangible code; Hardware refers to physical parts."},
          {q:"Which software is commonly used to write documents?", options:["Video Player","Web Browser","Word Processor (e.g. Word)","Paint program"], correct:2, explain:"Word processors are designed specifically for creating document files."},
          {q:"What is an Application (App)?", options:["Part of a mouse","Software designed for a specific task","A piece inside the CPU","A cable type"], correct:1, explain:"An app is software built for a specific purpose like drawing or learning."}
        ]
      },
      {
        id:3, title:"Internet & Digital Security", icon:"🌐", desc:"Learn how to stay safe online",
        questions:[
          {q:"What do we call the secret code that protects your account?", options:["Username","Email","Password","Link"], correct:2, explain:"A password is a secret key that only you should know."},
          {q:"If a stranger sends you an unknown link, what should you do?", options:["Open it immediately","Do not open it and inform a parent/teacher","Send it to friends","Enter personal info"], correct:1, explain:"Unknown links can be unsafe; always avoid clicking them and inform an adult."},
          {q:"Which of these is considered 'Personal Info' that shouldn't be shared with strangers?", options:["Favorite color","Full name, address, and phone number","Favorite game","The weather"], correct:1, explain:"Full name, address, and phone number must be kept private and secure."},
          {q:"What best describes a strong password?", options:["1234","Your name only","Birthdate only","A mix of letters, numbers, and symbols hard to guess"], correct:3, explain:"Strong passwords combine uppercase, lowercase, numbers, and symbols."},
          {q:"What should you do if someone bothers you online?", options:["Ignore it and keep talking","Tell a trusted adult immediately","Delete without telling anyone","Reply back rudely"], correct:1, explain:"Reporting unpleasant encounters to a trusted adult is always the right step."}
        ]
      },
      {
        id:4, title:"Tech, Health & Life", icon:"⚖️", desc:"Balance technology with daily life",
        questions:[
          {q:"How often should you take screen breaks to rest your eyes?", options:["After 5 hours straight","Every 20-30 minutes","Never take breaks","Only when in pain"], correct:1, explain:"Taking short breaks every 20-30 minutes protects eye health."},
          {q:"Which activity helps maintain a healthy digital balance?", options:["Screen time all day","Ignoring homework","Outdoor play, reading, and family time","Staying up late gaming"], correct:2, explain:"Balancing screen time with offline family and physical activities is healthier."},
          {q:"Why shouldn't you use screens right before sleep?", options:["It heats up the device","Screen light negatively affects sleep quality","No real reason","It drains the battery"], correct:1, explain:"Screen lighting disrupts sleep hormones, making it harder to rest."},
          {q:"What is the difference between learning tech and excessive gaming?", options:["No difference","Learning builds skills; excessive gaming eats away productive time","Gaming is always better","Learning is useless"], correct:1, explain:"Educational tech builds useful knowledge, whereas excessive entertainment wastes time."},
          {q:"What is a good ergonomic habit while using a computer?", options:["Sitting very close to screen","Sitting upright at a safe distance","Laptop on knees for hours","Slouching"], correct:1, explain:"Sitting upright with proper screen distance protects your back and posture."}
        ]
      },
      {
        id:5, title:"Final Challenge & Review", icon:"🏆", desc:"Test all your knowledge in the ultimate quiz",
        questions:[
          {q:"Which component stores data temporarily while running?", options:["Hard Drive","RAM Memory","Printer","Mouse"], correct:1, explain:"RAM stores active temporary data and clears when turned off."},
          {q:"What is the global network connecting millions of devices?", options:["CPU","Internet","Keyboard","Monitor"], correct:1, explain:"The Internet is a global interconnecting network of devices."},
          {q:"What should a secure password include when creating a new email?", options:["Your name only","0000","Upper/lowercase letters, numbers, and symbols","Birthdate only"], correct:2, explain:"A mix of character types makes passwords resistant to guessing."},
          {q:"What is the goal of 'Digital Balance'?", options:["Use devices non-stop","Use technology beneficially without hurting health/social life","Avoid technology completely","Play games only"], correct:1, explain:"Digital balance means leveraging technology without compromising health."},
          {q:"What is the first thing a believer should start their day with?", options:["Opening the PC","Prayer & remembering God","Watching TV","Eating only"], correct:1, explain:"Starting the day with prayer and spiritual mindfulness sets a wholesome foundation."}
        ]
      }
    ]
  };

  var APPRECIATION = {
    ar: { high: ["مبدع رقمي 🌟","خبير تقنية صاعد 🚀"], mid: ["مستكشف تقني 🧭","متعلم واعد 🌱"], low: ["مستكشف مبتدئ 🌤️"] },
    he: { high: ["מדען דיגיטלי 🌟","מומחה טכנולוגיה 🚀"], mid: ["חוקר טכנולוגיה 🧭","לומד מבטיח 🌱"], low: ["חוקר מתחיל 🌤️"] },
    en: { high: ["Digital Genius 🌟","Tech Wizard 🚀"], mid: ["Tech Explorer 🧭","Promising Learner 🌱"], low: ["Novice Explorer 🌤️"] }
  };

  /* State */
  var state = {
    name: "", avatar: AVATARS[0],
    currentLevel: 0, currentQ: 0, levelCorrect: 0,
    levelStars: {}, levelScores: {}, levelDone: {},
    totalStars: 0, totalCorrect: 0, totalQuestions: 25,
    answeredThisQ: false
  };
  var STORAGE_KEY = "computer-adventure-progress-v3";

  function $(id){ return document.getElementById(id); }
  function escapeHTML(str){
    return String(str).replace(/[&<>"']/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];
    });
  }

  /* Translation Engine */
  async function loadLanguage(lang) {
    try {
      var res = await fetch(`./lang/${lang}.json`);
      if (!res.ok) throw new Error("Translation file not found");
      i18nData = await res.json();
      currentLang = lang;

      document.documentElement.dir = i18nData.dir || "rtl";
      document.documentElement.lang = lang;

      // Translate text elements
      document.querySelectorAll('[data-i18n]').forEach(function(el){
        var key = el.getAttribute('data-i18n');
        if (i18nData[key]) el.textContent = i18nData[key];
      });

      // Translate placeholders
      document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
        var key = el.getAttribute('data-i18n-ph');
        if (i18nData[key]) el.placeholder = i18nData[key];
      });

      localStorage.setItem('user_lang', lang);

      // Re-render map or active screen if necessary
      if (!$("screen-map").classList.contains("hidden")) renderMap();
      if (!$("screen-quiz").classList.contains("hidden")) renderQuestion();

    } catch (e) {
      console.error(e);
    }
  }

  function sanitizeName(raw){
    return String(raw).replace(/[<>\/"'`]/g, "").trim().slice(0,20);
  }

  function recalculateTotalCorrect(){
    state.totalCorrect = Object.keys(state.levelScores).reduce(function(tot, id){
      return tot + (Number(state.levelScores[id]) || 0);
    }, 0);
  }

  function persistState(){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        name: state.name, avatar: state.avatar,
        levelStars: state.levelStars, levelScores: state.levelScores,
        levelDone: state.levelDone, totalStars: state.totalStars
      }));
    } catch(e){}
  }

  function restoreState(){
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!saved || !saved.name) return false;
      state.name = sanitizeName(saved.name);
      state.avatar = AVATARS.indexOf(saved.avatar) >= 0 ? saved.avatar : AVATARS[0];
      state.levelStars = saved.levelStars || {};
      state.levelScores = saved.levelScores || {};
      state.levelDone = saved.levelDone || {};
      state.totalStars = Number(saved.totalStars) || 0;
      recalculateTotalCorrect();
      return true;
    } catch(e){ return false; }
  }

  function showScreen(id){
    document.querySelectorAll(".screen").forEach(function(s){ s.classList.add("hidden"); });
    $(id).classList.remove("hidden");
    window.scrollTo({top:0, behavior:"smooth"});
  }

  function updateChip(){
    var chip = $("playerChip");
    if (state.name){
      chip.classList.add("show");
      $("chipName").textContent = state.name;
      $("chipAvatar").textContent = state.avatar;
      $("chipStars").textContent = state.totalStars;
    }
  }

  function buildAvatarGrid(){
    var grid = $("avatarGrid");
    grid.innerHTML = "";
    AVATARS.forEach(function(av, idx){
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "avatar-opt" + (idx===0 ? " selected" : "");
      btn.textContent = av;
      btn.addEventListener("click", function(){
        grid.querySelectorAll(".avatar-opt").forEach(function(b){ b.classList.remove("selected"); });
        btn.classList.add("selected");
        state.avatar = av;
        updateChip();
        persistState();
      });
      grid.appendChild(btn);
    });
  }

  function renderMap(){
    var wrap = $("levelNodes");
    wrap.innerHTML = "";
    var doneCount = 0;
    var levels = LEVELS_DATA[currentLang] || LEVELS_DATA.ar;

    levels.forEach(function(level, idx){
      var isDone = !!state.levelDone[level.id];
      var isLocked = idx > 0 && !state.levelDone[levels[idx-1].id];
      if (isDone) doneCount++;

      var node = document.createElement("div");
      node.className = "level-node" + (isLocked ? " locked" : "") + (isDone ? " done" : "");

      var starsHtml = "";
      var stars = state.levelStars[level.id] || 0;
      for (var s=1; s<=3; s++){ starsHtml += (s<=stars ? "⭐" : "☆"); }

      node.innerHTML =
        '<div class="node-icon">'+ level.icon +'</div>' +
        '<div class="node-info">' +
          '<b>' + (i18nData.map_stages ? i18nData.map_stages : "مرحلة") + ' ' + level.id + ': ' + escapeHTML(level.title) + '</b>' +
          '<span>' + escapeHTML(level.desc) + '</span>' +
        '</div>' +
        (isLocked ? '<div class="node-lock">🔒</div>' : '<div class="node-stars">'+ starsHtml +'</div>');

      if (!isLocked){
        node.addEventListener("click", function(){ startLevel(level.id); });
      }
      wrap.appendChild(node);
    });

    $("mapProgressLabel").textContent = doneCount + " / " + levels.length;
    $("mapProgressFill").style.width = (doneCount / levels.length * 100) + "%";
    $("mapStarsLabel").textContent = "⭐ " + state.totalStars;

    if (doneCount === levels.length){
      renderCertificate();
    }
  }

  function startLevel(levelId){
    state.currentLevel = levelId;
    state.currentQ = 0;
    state.levelCorrect = 0;
    renderQuestion();
    showScreen("screen-quiz");
  }

  function getLevel(){
    var levels = LEVELS_DATA[currentLang] || LEVELS_DATA.ar;
    return levels.find(function(l){ return l.id === state.currentLevel; });
  }

  function renderQuestion(){
    var level = getLevel();
    if(!level) return;
    var q = level.questions[state.currentQ];
    state.answeredThisQ = false;

    $("quizLevelTag").textContent = level.title;
    
    var qLabel = i18nData.q_label || "السؤال {cur} من {total}";
    $("quizQuestionLabel").textContent = qLabel.replace("{cur}", state.currentQ + 1).replace("{total}", level.questions.length);

    var progWrap = $("quizProgress");
    progWrap.innerHTML = "";
    level.questions.forEach(function(_, i){
      var dot = document.createElement("span");
      dot.className = "quiz-dot" + (i < state.currentQ ? " done" : (i === state.currentQ ? " active" : ""));
      progWrap.appendChild(dot);
    });

    $("questionText").textContent = q.q;

    var optionsGrid = $("optionsGrid");
    optionsGrid.innerHTML = "";
    var letters = currentLang === "en" ? ["A","B","C","D"] : (currentLang === "he" ? ["א","ב","ג","ד"] : ["أ","ب","ج","د"]);
    
    q.options.forEach(function(opt, i){
      var btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerHTML = '<span class="option-letter">'+ letters[i] +'</span><span>'+ escapeHTML(opt) +'</span>';
      btn.addEventListener("click", function(){ handleAnswer(i, btn); });
      optionsGrid.appendChild(btn);
    });

    $("feedbackBox").classList.remove("show","good","bad");
    $("nextQBtn").disabled = true;
    
    var isLast = (state.currentQ === level.questions.length - 1);
    var btnText = isLast ? (i18nData.show_res_btn || "عرض النتيجة") : (i18nData.next_btn || "التالي");
    $("nextQBtn").querySelector('span:first-child').textContent = btnText;
  }

  function handleAnswer(selectedIdx, btnEl){
    if (state.answeredThisQ) return;
    state.answeredThisQ = true;

    var level = getLevel();
    var q = level.questions[state.currentQ];
    var allBtns = document.querySelectorAll("#optionsGrid .option-btn");
    allBtns.forEach(function(b){ b.disabled = true; });

    var isCorrect = selectedIdx === q.correct;
    if (isCorrect){
      btnEl.classList.add("correct");
      state.levelCorrect++;
    } else {
      btnEl.classList.add("wrong");
      allBtns[q.correct].classList.add("correct");
    }

    var fb = $("feedbackBox");
    fb.classList.add("show", isCorrect ? "good" : "bad");
    $("feedbackIcon").textContent = isCorrect ? "✅" : "💡";
    
    var cHead = isCorrect ? (i18nData.correct_text || "إجابة صحيحة!") : (i18nData.wrong_text || "ليست إجابة صحيحة.");
    $("feedbackText").textContent = cHead + " " + q.explain;

    $("nextQBtn").disabled = false;
  }

  $("nextQBtn").addEventListener("click", function(){
    var level = getLevel();
    if (state.currentQ < level.questions.length - 1){
      state.currentQ++;
      renderQuestion();
    } else {
      finishLevel();
    }
  });

  function finishLevel(){
    var level = getLevel();
    var total = level.questions.length;
    var correct = state.levelCorrect;
    var stars = correct >= 4 ? 3 : (correct === 3 ? 2 : 1);

    var prevStars = state.levelStars[level.id] || 0;
    if (stars > prevStars){
      state.totalStars += (stars - prevStars);
      state.levelStars[level.id] = stars;
    }
    state.levelScores[level.id] = correct;
    recalculateTotalCorrect();
    state.levelDone[level.id] = true;
    persistState();

    $("resultBadge").textContent = stars === 3 ? "🎉 3/3" : (stars === 2 ? "👏 2/3" : "🌱 1/3");
    $("resultTitle").textContent = i18nData.res_completed || "أكملت المرحلة!";
    $("resultScore").textContent = correct + " / " + total;

    var starSpans = document.querySelectorAll("#resultStars span");
    starSpans.forEach(function(s, i){ s.classList.toggle("earned", i < stars); });

    var levels = LEVELS_DATA[currentLang] || LEVELS_DATA.ar;
    var nextLevel = levels.find(function(l){ return l.id === level.id + 1; });
    var nextBtn = $("resultNextBtn");
    
    if (nextLevel){
      nextBtn.querySelector('span:first-child').textContent = i18nData.next_stage_btn || "المرحلة التالية";
      nextBtn.onclick = function(){ startLevel(nextLevel.id); };
    } else {
      nextBtn.querySelector('span:first-child').textContent = i18nData.get_cert_btn || "استلم شهادتك 🎓";
      nextBtn.onclick = function(){ renderCertificate(); showScreen("screen-certificate"); };
    }

    updateChip();
    showScreen("screen-result");
  }

  $("resultMapBtn").addEventListener("click", function(){
    renderMap();
    showScreen("screen-map");
  });

  function renderCertificate(){
    var pct = Math.round((state.totalCorrect / state.totalQuestions) * 100);
    var tier = pct >= 85 ? "high" : (pct >= 60 ? "mid" : "low");
    var titles = APPRECIATION[currentLang][tier];
    var title = titles[Math.floor(Math.random() * titles.length)];

    $("certName").textContent = state.avatar + "  " + state.name;
    $("certStars").textContent = state.totalStars;
    $("certScore").textContent = pct + "%";
    $("certLevel").textContent = title;
  }

  $("printCertBtn").addEventListener("click", function(){ window.print(); });

  $("restartBtn").addEventListener("click", function(){
    state.currentLevel = 0; state.currentQ = 0; state.levelCorrect = 0;
    state.levelStars = {}; state.levelScores = {}; state.levelDone = {};
    state.totalStars = 0; state.totalCorrect = 0;
    persistState();
    updateChip();
    renderMap();
    showScreen("screen-map");
  });

  /* Language Selector Listener */
  $("langSelect").addEventListener("change", function(e){
    loadLanguage(e.target.value);
  });

  /* Setup & Navigation Listeners */
  $("startBtn").addEventListener("click", function(){ showScreen("screen-prayer"); });
  $("prayerContinueBtn").addEventListener("click", function(){ showScreen("screen-setup"); });

  $("setupContinueBtn").addEventListener("click", function(){
    var raw = $("playerName").value || "";
    var clean = sanitizeName(raw);
    if (!clean){
      $("nameError").textContent = i18nData.err_name || "من فضلك اكتب اسمك أولًا.";
      $("playerName").focus();
      return;
    }
    $("nameError").textContent = "";
    state.name = clean;
    updateChip();
    persistState();
    renderMap();
    showScreen("screen-map");
  });

  /* Initialization */
  buildAvatarGrid();
  var savedLang = localStorage.getItem('user_lang') || 'ar';
  $("langSelect").value = savedLang;
  loadLanguage(savedLang);

  if (restoreState()){
    updateChip();
    renderMap();
    showScreen("screen-map");
  } else {
    showScreen("screen-welcome");
  }

  function goBack() {
  // إذا كان هناك سجل سابق في المتصفح، يرجع للخطوة السابقة
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // خيار بديل: إذا فتح المستخدم الصفحة مباشرة، يعيده للرئيسية
    showScreen('main-menu'); 
  }
}

})();