# Zone01 AI assisted testing starter

Μικρή εκπαιδευτική άσκηση για test harness, AI review, Docker και CI. Η εφαρμογή είναι το δημόσιο TodoMVC demo του Playwright. Χρειάζεται πρόσβαση στο internet σε κάθε test run. Δεν είναι κώδικας ή επιβεβαιωμένο stack της Danaos.

## Γρήγορη εκκίνηση

Αποσυμπιέστε το ZIP και ανοίξτε τον φάκελο που περιέχει package.json στο VS Code. Χρειάζεστε Node.js 22 LTS ή νεότερη υποστηριζόμενη LTS έκδοση και npm.

```sh
npm ci
npx playwright install chromium
npm test
npm run report
```

Σε Linux, αν λείπουν system dependencies: `npx playwright install --with-deps chromium` (ενδέχεται να ζητηθούν δικαιώματα εγκατάστασης). Το πρώτο κατέβασμα browser μπορεί να πάρει λίγα λεπτά.

Υπάρχουν δύο αρχικά tests. Υλοποιήστε τα υπόλοιπα τέσσερα από το TEST_PLAN.md. Μετά τη δική σας προσπάθεια μπορείτε να συγκρίνετε με reference/additional-tests.js. Για να εκτελέσετε την αναφορά, αντιγράψτε την ως tests/additional.spec.js. Μην κρατήσετε διπλά tests όταν έχετε ήδη δικές σας υλοποιήσεις.

## Σκόπιμο failure και trace

```sh
npm run test:broken
npm run report:broken
```

Το πρώτο command ΠΡΕΠΕΙ να αποτύχει: χρησιμοποιεί εσκεμμένα λάθος placeholder μέσω environment variable, χωρίς να αλλάζει αρχεία. Ανοίξτε το αποτυχημένο test και το trace από το HTML report. Εντοπίστε τη διαφορά από το πραγματικό input και εξηγήστε την. Με `npm test` επιστρέφετε στο κανονικό run. Τα broken reports αποθηκεύονται χωριστά.

## Docker

Ξεκινήστε Docker Desktop ή υπάρχον Docker Engine με Compose.

```sh
docker compose build
docker compose run --rm tests
```

Τα reports βρίσκονται στον τοπικό φάκελο playwright-report. Το image και το npm package είναι κλειδωμένα στην ίδια έκδοση 1.63.0. Το build εγκαθιστά το package με npm ci· το επίσημο image δίνει browsers και system dependencies. Δεν έχουν εκτελεστεί Docker ή hosted CI runs κατά την προετοιμασία του πακέτου· επαληθεύστε τα στο δικό σας περιβάλλον.

## GitHub Actions

Δημιουργήστε ξεχωριστό repository για αυτό το εκπαιδευτικό demo. Στο VS Code κάντε Source Control → Initialize Repository → commit → Publish to GitHub. Επιλέξτε public μόνο αν είναι αποκλειστικά το παρόν δημόσιο demo χωρίς προσωπικά/εταιρικά στοιχεία. Τα standard GitHub-hosted runners είναι δωρεάν για public repositories. Για private repo ελέγξτε τη διαθέσιμη δωρεάν ποσόστωση πριν το run.

Βεβαιωθείτε ότι ανέβηκαν το package-lock.json και το .github/workflows/tests.yml. Το workflow εκτελείται στο push. Ανοίξτε Actions, το run και το playwright-report artifact. Χρησιμοποιούμε hosted runner, όχι δικό σας server. Δεν καλείται AI model μέσα στο CI.

## AI προαιρετικά

Χρησιμοποιήστε Copilot Free στο VS Code ή ήδη διαθέσιμο coding assistant. Τα δωρεάν AI όρια είναι περιορισμένα. Αν εξαντληθούν, συνεχίστε χειροκίνητα με τα παραδείγματα και την τεκμηρίωση, χωρίς αγορά ή API key. Τα prompts βρίσκονται στο AI_PROMPTS.md.

Για συμβατό VS Code με Copilot agent mode μπορείτε προαιρετικά να τρέξετε `npx playwright init-agents --loop=vscode`. Ακολουθήστε τις τρέχουσες οδηγίες Playwright και ζητήστε planner, generator και διάγνωση βήμα βήμα. Ελέγχετε κάθε αλλαγή και κάθε εντολή. Αν η ρύθμιση πάρει πάνω από 10 λεπτά, συνεχίστε με τα prompts χωρίς ειδικούς agents.

## Τι θα προσθέσετε στο README για τη συνέντευξη

- Ποια σενάρια υλοποιήσατε εσείς και τι ελέγχει κάθε test.
- Πού χρησιμοποιήσατε AI και τι διορθώσατε μετά το review.
- Ποιο failure διαγνώσατε και με ποιο στοιχείο του trace.
- Ποιες εντολές τρέξατε πραγματικά, πού και με τι αποτέλεσμα.
- Τι θα βελτιώνατε για πραγματική εφαρμογή: ελεγχόμενο test environment, δεδομένα, secrets, περισσότερα είδη tests.

Οι οδηγίες και ο αρχικός κώδικας παρέχονται για μελέτη. Οι όροι χρήσης του Playwright και των υπόλοιπων εργαλείων ισχύουν ξεχωριστά.

## Η δουλειά μου

### Harness

Το harness μου συνδυάζει ένα Playwright configuration (ένα Chromium project, σταθερό baseURL, assertion timeout 5s, μηδενικά retries, HTML report, και trace μαζί με screenshot που κρατιούνται όταν υπάρχει αποτυχία) με ένα fixture `todo`, που ανοίγει την εφαρμογή και δίνει σε κάθε test το input, τη λίστα των items και έναν helper `add`. Κάθε test τρέχει σε νέο browser context και δημιουργεί τα δικά του δεδομένα με μοναδικά ονόματα, οπότε τα έξι tests περνούν μόνα τους, παράλληλα ή με οποιαδήποτε σειρά, και κάθε αποτυχία αφήνει στοιχεία για διάγνωση αντί να κρύβεται πίσω από retries.

### Σενάρια και τι ελέγχει κάθε test

Όλα τα tests βρίσκονται στο `tests/todo.spec.js` και χρησιμοποιούν το fixture `todo`.

| Test | Ποιος το έγραψε | Τι αποδεικνύει |
| --- | --- | --- |
| adds a todo and clears the input | αρχικό project | Ακριβώς ένα item με σωστό κείμενο, ξεκινά active (unchecked), το input καθαρίζει |
| marks a todo as completed | αρχικό project | Το checkbox γίνεται checked και το item παίρνει την class `completed` |
| removes a todo | εγώ, με review από AI | Μετά από hover και click στο Delete μένει ακριβώς `['Keep me']`, άρα σβήστηκε το σωστό item |
| filters completed and active todos | εγώ, με review από AI | Active και Completed δείχνουν μόνο το σωστό item, All δείχνει και τα δύο με τη σειρά προσθήκης |
| rejects a whitespace only todo | AI, με δικό μου review | Με ένα υπάρχον item, το Enter με μόνο κενά δεν προσθέτει δεύτερο item |
| keeps text and completion after reload | AI, με δικό μου review | Μετά το reload διατηρούνται το κείμενο και η κατάσταση completed (localStorage) |

Πριν γράψω κώδικα επιβεβαίωσα χειροκίνητα όλα τα σενάρια στο demo: το κουμπί × εμφανίζεται μόνο με hover, τα φίλτρα αλλάζουν το URL σε `#/active` και `#/completed`, η εφαρμογή κάνει trim στο κείμενο και τα δεδομένα αποθηκεύονται στο localStorage.

### Πού χρησιμοποίησα AI και τι διόρθωσα

Χρησιμοποίησα το Claude Code ως mentor με τα prompts του `AI_PROMPTS.md`: ένα σενάριο κάθε φορά, run, review, και μετά το επόμενο.

- **Delete test:** στην πρώτη μου εκδοχή είχα `expect(...).hover()`, δηλαδή ανακάτευα assertion με action, και έλειπαν τα δεδομένα και το τελικό assertion. Μετά το review το ξανάγραψα ως add → add → filter → hover → click → expect.
- **Filters test:** το review βρήκε `toBeChecked()` εκεί που χρειαζόταν `.check()`, locators για links χωρίς `.click()` (ένα locator είναι lazy και δεν κάνει τίποτα μόνο του) και ένα βήμα All που έλειπε. Τα διόρθωσα και το έτρεξα μέχρι να περάσει.
- **Whitespace και reload tests:** τα έγραψε το AI. Τα έλεγξα κάνοντας ένα test να αποτύχει σκόπιμα (άλλαξα το expected σε `['Existing']` και έγινε κόκκινο), για να επιβεβαιώσω ότι το assertion μπορεί πραγματικά να πιάσει λάθος.
- **CI:** για το warning «Node.js 20 is deprecated» επιβεβαίωσα στη σελίδα releases ότι το `actions/upload-artifact@v6` τρέχει σε Node 24 πριν κάνω την αλλαγή.
- **Τι δεν δέχομαι από AI:** delete, skip ή αποδυνάμωση assertions για να γίνει πράσινο το run. Για παράδειγμα, το `.first()` θα «έλυνε» το strict mode error, αλλά θα έκρυβε την ασάφεια του locator.

### Failures που διέγνωσα

1. **Strict mode violation (δικό μου λάθος στο delete test).** Το error έδειχνε ότι το `filter({ hasText: 'Remove me' })` βρήκε 2 στοιχεία, `Remove me` και `Dont remove me`, επειδή το `hasText` κάνει substring match χωρίς διάκριση κεφαλαίων. Αιτία: τα test data μου. Διόρθωση: σαφή, μη επικαλυπτόμενα ονόματα (`Keep me`), όχι `.first()`.
2. **Σκόπιμο failure (`npm run test:broken`).** Το test έληξε με timeout στο `locator.fill`. Το call log έδειχνε `waiting for getByPlaceholder('INTENTIONALLY WRONG PLACEHOLDER')` χωρίς κανένα match, ενώ στο snapshot του trace το input υπάρχει με `placeholder="What needs to be done?"`. Το `page.goto` πέτυχε χωρίς console ή network errors. Αιτία: λάθος locator στο fixture του harness, όχι η εφαρμογή ή το περιβάλλον. Επιβεβαίωση: το `npm test` χωρίς `BROKEN_SELECTOR` περνάει.
3. **CI run cancelled (περιβάλλον).** Το πρώτο run ακυρώθηκε από το `timeout-minutes: 10`. Στο log του `playwright install --with-deps` το apt κόλλησε στο πακέτο `fonts-freefont-ttf` από τον Ubuntu mirror (`Ign:3` και μετά επανάληψη). Τα tests δεν είχαν καν ξεκινήσει. Το re-run πέρασε.

### Εντολές που έτρεξα και αποτελέσματα

Τοπικά σε Ubuntu 24.04 με Node.js 24.12:

| Εντολή | Αποτέλεσμα |
| --- | --- |
| `npm ci`, `npx playwright install --with-deps chromium` | εγκατάσταση OK (το πρώτο `npm ci` απέτυχε γιατί έτρεξα στον γονικό φάκελο) |
| `npm test` | 6 passed |
| `npx playwright test --grep "removes"` | 1 passed (ένα test μόνο του) |
| `npx playwright test --workers=1` | 6 passed (σειριακά) |
| `npx playwright test --workers=1 --repeat-each=3` | 18 passed (έλεγχος για flaky tests) |
| `npm run test:broken` | 1 failed, όπως αναμενόταν |
| `docker compose build` | OK, ~530s την πρώτη φορά, κυρίως λήψη του image (`npm ci`: 2.5s) |
| `docker compose run --rm tests` | 6 passed με 1 worker (`CI=1`) |
| GitHub Actions | 1ο run cancelled (apt mirror), re-run passed, run με `upload-artifact@v6` passed χωρίς warning, report διαθέσιμο ως artifact |

Repository και CI run: `<βάλε εδώ το link>`

### Τι θα βελτίωνα για πραγματική εφαρμογή

- **Ελεγχόμενο test environment:** δικό μας staging ή τοπικό container της εφαρμογής, όχι δημόσιο demo στο internet.
- **Δεδομένα:** δημιουργία και καθαρισμός δεδομένων μέσω API ή seed scripts αντί για το UI, ώστε τα tests να είναι γρηγορότερα και να μη μοιράζονται κατάσταση.
- **Login:** ένα setup project που κάνει login μία φορά και αποθηκεύει το `storageState`, το οποίο ξαναχρησιμοποιούν τα tests.
- **Secrets:** credentials σε GitHub Secrets ή environment variables, ποτέ στον κώδικα ή στα reports.
- **CI:** το job να τρέχει μέσα στο ίδιο Playwright container image που χρησιμοποιώ τοπικά, ώστε να μην εξαρτάται από apt mirrors. Επίσης sharding όταν μεγαλώσει το suite.
- **Περισσότερα είδη tests:** API tests, accessibility checks, visual comparisons και περισσότεροι browsers (Firefox, WebKit).
