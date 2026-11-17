(function () {
  "use strict";
  window.I18N = window.I18N || {};
  window.I18N.en = {
    lang: "en", dir: "ltr",
    ui: { brandName: "Computer Adventure", brandTagline: "A journey through the basics of technology", points: "points", back: "Back", changeLang: "Change language", help: "Help", close: "Close", footer: "Computer Adventure · Learn and explore" },
    about: { eyebrow: "🎮 Interactive learning game", title: "Welcome to Computer Adventure!", intro: "Explore the world of computers and technology through short levels and fun questions. Collect stars and finish every level to earn your certificate.", ageTitle: "Ages 10–18", ageSub: "Learn by playing, at your own pace.", f1Title: "Learn", f1Text: "Discover computer and technology concepts.", f2Title: "Collect stars", f2Text: "Answer questions and progress through levels.", f3Title: "Earn a certificate", f3Text: "Complete the levels and celebrate your achievement.", howTitle: "How to play", step1: "Choose a name and avatar.", step2: "Start the available level on the map.", step3: "Read each question and choose the right answer.", step4: "Collect stars to unlock more levels.", step5: "Finish all levels to earn your certificate.", cta: "Let’s start" },
    setup: { title: "Tell us about yourself", subtitle: "Choose a name and avatar to get started.", nameLabel: "Player name", namePlaceholder: "Enter your name", avatarLabel: "Choose your avatar", cta: "Continue to map", errorEmpty: "Please enter your name.", errorShort: "Your name must be at least two characters." },
    map: { title: "Adventure Map", subtitle: "Complete levels and collect stars to unlock the path.", stage: "Level" },
    quiz: { stage: "Level", question: "Question", of: "of", letters: ["A", "B", "C", "D"], next: "Next question", finish: "Finish level", correctPrefix: "Correct! ", wrongPrefix: "That’s not correct. ", correct: "Well done!", wrong: "Try again!" },
    result: { excellent: "Excellent! ⭐⭐⭐", good: "Well done!", keepGoing: "Keep trying!", completed: "You completed", correctOf: "correct out of", nextBtn: "Next level", mapBtn: "Back to map", certBtn: "View certificate" },
    certificate: { kicker: "An achievement worth celebrating", title: "Computer Adventure Certificate", title2: "Title", stars: "Stars", score: "Score", print: "Print certificate", restart: "Start over", titlesHigh: ["Tech Expert", "Computer Champion", "Tech Genius"], titlesMid: ["Tech Explorer", "Rising Learner", "Computer Friend"], titlesLow: ["Persistent Learner", "Curious Explorer", "A Great Start"], msgHigh: "Outstanding work! You mastered many computer concepts.", msgMid: "Great work! Keep learning and you’ll become an expert.", msgLow: "Every expert started by learning. Keep going!" },
    help: { title: "Help", subtitle: "Send us feedback or a question.", typeLabel: "Message type", typeBug: "Report a problem", typeLang: "Language feedback", typeQuestion: "Question", typeHelp: "Request help", typeOther: "Other", msgLabel: "Your message", msgPlaceholder: "Write your message here...", emailLabel: "Your email (optional)", emailPlaceholder: "name@example.com", cancel: "Cancel", send: "Send", thanks: "Thank you! An email message will open so you can send your feedback.", errorMsg: "Please enter a message.", errorEmail: "Please check the email address." },
    prompts: { exit: "Leave this level and return to the map?", changeLanguage: "Change language? You will return to the start screen.", restart: "Reset the game? All progress will be lost." },
    levels: [
      { id: 1, icon: "🖥️", title: "Computer Components", desc: "Meet the parts of a computer", questions: [
        { q: "Which part is the computer’s brain and executes instructions?", options: ["Processor", "Monitor", "Mouse", "Speaker"], correct: 0, explain: "The processor executes instructions and processes data." },
        { q: "What does RAM do?", options: ["Stores files permanently", "Temporarily stores data in use", "Displays pictures", "Prints documents"], correct: 1, explain: "RAM temporarily holds what the computer needs while programs are running." },
        { q: "Which device is used to enter text?", options: ["Monitor", "Keyboard", "Printer", "Speaker"], correct: 1, explain: "We use a keyboard to type text and commands." },
        { q: "Which of these is an output device?", options: ["Mouse", "Microphone", "Monitor", "Keyboard"], correct: 2, explain: "A monitor displays information to the user, so it is an output device." },
        { q: "What is the purpose of a hard drive or SSD?", options: ["Store files and programs", "Move the pointer", "Record audio only", "Cool the room"], correct: 0, explain: "Storage drives keep files and programs even after the computer is turned off." }
      ] },
      { id: 2, icon: "⌨️", title: "Operating Systems and Software", desc: "Discover how computers work", questions: [
        { q: "What is an operating system?", options: ["Software that manages computer resources", "A type of monitor", "An image file", "An internet cable"], correct: 0, explain: "An operating system manages the device and lets apps run." },
        { q: "Which of these is an operating system?", options: ["Windows", "Keyboard", "USB", "HDMI"], correct: 0, explain: "Windows is an operating system, as are macOS, Linux, and others." },
        { q: "Which app is best for writing a document?", options: ["Word processor", "Music player", "Calculator", "Photo viewer"], correct: 0, explain: "Word processors are used to create and edit documents." },
        { q: "What does Save do?", options: ["Deletes a file", "Saves changes to a file", "Turns off the screen", "Restarts the internet"], correct: 1, explain: "Save keeps your changes so you can return to them later." },
        { q: "What is a software update?", options: ["An improvement or fix", "Deleting all files", "Always shutting down the device", "Changing the keyboard"], correct: 0, explain: "Updates can add features, improve security, and fix errors." }
      ] },
      { id: 3, icon: "🌐", title: "Internet and Networks", desc: "Learn the basics of connecting", questions: [
        { q: "What is the internet?", options: ["A global network connecting many devices", "A drawing program only", "A type of printer", "A file on a computer"], correct: 0, explain: "The internet is a global network that lets devices exchange information." },
        { q: "What does a web browser do?", options: ["Opens web pages and sites", "Cleans the screen", "Charges a computer", "Only prints pictures"], correct: 0, explain: "Browsers such as Firefox or Chrome display websites." },
        { q: "What helps protect your account?", options: ["A strong, unique password", "Sharing your password", "Using 1234", "Writing it in a public place"], correct: 0, explain: "Use a long, unique password and don’t share it." },
        { q: "What does the lock icon beside a website address usually mean?", options: ["The connection is encrypted", "The site is always free", "No internet is needed", "The device is locked"], correct: 0, explain: "The lock usually indicates an encrypted HTTPS connection." },
        { q: "What should you do with a suspicious link from a stranger?", options: ["Don’t open it; check its source", "Click it right away", "Send your details", "Forward it to everyone"], correct: 0, explain: "Avoid suspicious links and ask someone you trust if you’re unsure." }
      ] },
      { id: 4, icon: "🧠", title: "Computational Thinking", desc: "Solve problems step by step", questions: [
        { q: "What is an algorithm?", options: ["Ordered steps for solving a problem", "Part of a monitor", "A type of file", "A password"], correct: 0, explain: "An algorithm is a clear set of steps for reaching a result." },
        { q: "What is a variable in programming?", options: ["A place to store a value that can change", "An input device", "A web page", "A cable"], correct: 0, explain: "A variable stores a value that a program can use or change." },
        { q: "What does an if statement do?", options: ["Chooses what happens based on a condition", "Prints every file", "Turns off the internet", "Deletes a program"], correct: 0, explain: "Conditions let a program make decisions based on a situation." },
        { q: "Why use a loop?", options: ["To run a set of instructions more than once", "To turn off the computer", "To change the device language", "To delete data"], correct: 0, explain: "A loop repeats instructions instead of writing them again each time." },
        { q: "What is a good first step when a program has an error?", options: ["Check the steps and try to fix it", "Delete everything immediately", "Always ignore it", "Turn off the monitor"], correct: 0, explain: "Debugging starts by understanding the message and checking steps one at a time." }
      ] },
      { id: 5, icon: "🔐", title: "Digital Safety", desc: "Use technology responsibly", questions: [
        { q: "Which password is strongest?", options: ["123456", "Only your name", "A long, unique passphrase", "password"], correct: 2, explain: "A long, unique passphrase is harder to guess." },
        { q: "Should you share your address or personal details with strangers?", options: ["Yes, always", "No, protect your privacy", "If they ask nicely", "Post them for everyone"], correct: 1, explain: "Protect personal information and don’t share it with strangers." },
        { q: "What should you do if someone bothers you online?", options: ["Save evidence and tell a trusted adult", "Send them your information", "Meet them alone", "Forward the message to everyone"], correct: 0, explain: "Block the person and tell a parent or another trusted adult." },
        { q: "Why keep security software updated?", options: ["To help defend against new threats", "To deliberately slow the device", "To share your password", "To remove the internet"], correct: 0, explain: "Updates help detect new threats and vulnerabilities." },
        { q: "What is responsible digital behavior?", options: ["Respect others and check information", "Spread rumors", "Bully others", "Copy others’ work and claim it"], correct: 0, explain: "Respect and checking information are part of digital citizenship." }
      ] }
    ]
  };
})();
