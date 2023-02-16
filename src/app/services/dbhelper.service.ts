import { Injectable, NgZone } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, deleteUser, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from "@angular/fire/auth";
import { Database, set, ref, update, get, remove, } from "@angular/fire/database";
import { Router } from '@angular/router';
import { getDatabase, onValue, push } from 'firebase/database';
import { NgToastComponent, NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { MatDialog } from '@angular/material/dialog';
import { concatMap, Observable, of } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import { DbstorageService } from './dbstorage.service';
import { formatDate } from '@angular/common';
import { SentimentAlgoService } from './sentiment-algo.service';
@Injectable({
  providedIn: 'root'
})
export class DbhelperService {

  positiveWords = ["a+", "abound", "abounds", "abundance", "abundant", "accessable", "accessible", "acclaim", "acclaimed", "acclamation", "accolade", "accolades", "accommodative", "accomodative", "accomplish", "accomplished", "accomplishment", "accomplishments", "accurate", "accurately", "achievable", "achievement", "achievements", "achievible", "acumen", "adaptable", "adaptive", "adequate", "adjustable", "admirable", "admirably", "admiration", "admire", "admirer", "admiring", "admiringly", "adorable", "adore", "adored", "adorer", "adoring", "adoringly", "adroit", "adroitly", "adulate", "adulation", "adulatory", "advanced", "advantage", "advantageous", "advantageously", "advantages", "adventuresome", "adventurous", "advocate", "advocated", "advocates", "affability", "affable", "affably", "affectation", "affection", "affectionate", "affinity", "affirm", "affirmation", "affirmative", "affluence", "affluent", "afford", "affordable", "affordably", "afordable", "agile", "agilely", "agility", "agreeable", "agreeableness", "agreeably", "all-around", "alluring", "alluringly", "altruistic", "altruistically", "amaze", "amazed", "amazement", "amazes", "amazing", "amazingly", "ambitious", "ambitiously", "ameliorate", "amenable", "amenity", "amiability", "amiabily", "amiable", "amicability", "amicable", "amicably", "amity", "ample", "amply", "amuse", "amusing", "amusingly", "angel", "angelic", "apotheosis", "appeal", "appealing", "applaud", "appreciable", "appreciate", "appreciated", "appreciates", "appreciative", "appreciatively", "appropriate", "approval", "approve", "ardent", "ardently", "ardor", "articulate", "aspiration", "aspirations", "aspire", "assurance", "assurances", "assure", "assuredly", "assuring", "astonish", "astonished", "astonishing", "astonishingly", "astonishment", "astound", "astounded", "astounding", "astoundingly", "astutely", "attentive", "attraction", "attractive", "attractively", "attune", "audible", "audibly", "auspicious", "authentic", "authoritative", "autonomous", "available", "aver", "avid", "avidly", "award", "awarded", "awards", "awe", "awed", "awesome", "awesomely", "awesomeness", "awestruck", "awsome", "backbone", "balanced", "bargain", "beauteous", "beautiful", "beautifullly", "beautifully", "beautify", "beauty", "beckon", "beckoned", "beckoning", "beckons", "believable", "believeable", "beloved", "benefactor", "beneficent", "beneficial", "beneficially", "beneficiary", "benefit", "benefits", "benevolence", "benevolent", "benifits", "best", "best-known", "best-performing", "best-selling", "better", "better-known", "better-than-expected", "beutifully", "blameless", "bless", "blessing", "bliss", "blissful", "blissfully", "blithe", "blockbuster", "bloom", "blossom", "bolster", "bonny", "bonus", "bonuses", "boom", "booming", "boost", "boundless", "bountiful", "brainiest", "brainy", "brand-new", "brave", "bravery", "bravo", "breakthrough", "breakthroughs", "breathlessness", "breathtaking", "breathtakingly", "breeze", "bright", "brighten", "brighter", "brightest", "brilliance", "brilliances", "brilliant", "brilliantly", "brisk", "brotherly", "bullish", "buoyant", "cajole", "calm", "calming", "calmness", "capability", "capable", "capably", "captivate", "captivating", "carefree", "cashback", "cashbacks", "catchy", "celebrate", "celebrated", "celebration", "celebratory", "champ", "champion", "charisma", "charismatic", "charitable", "charm", "charming", "charmingly", "chaste", "cheaper", "cheapest", "cheer", "cheerful", "cheery", "cherish", "cherished", "cherub", "chic", "chivalrous", "chivalry", "civility", "civilize", "clarity", "classic", "classy", "clean", "cleaner", "cleanest", "cleanliness", "cleanly", "clear", "clear-cut", "cleared", "clearer", "clearly", "clears", "clever", "cleverly", "cohere", "coherence", "coherent", "cohesive", "colorful", "comely", "comfort", "comfortable", "comfortably", "comforting", "comfy", "commend", "commendable", "commendably", "commitment", "commodious", "compact", "compactly", "compassion", "compassionate", "compatible", "competitive", "complement", "complementary", "complemented", "complements", "compliant", "compliment", "complimentary", "comprehensive", "conciliate", "conciliatory", "concise", "confidence", "confident", "congenial", "congratulate", "congratulation", "congratulations", "congratulatory", "conscientious", "considerate", "consistent", "consistently", "constructive", "consummate", "contentment", "continuity", "contrasty", "contribution", "convenience", "convenient", "conveniently", "convience", "convienient", "convient", "convincing", "convincingly", "cool", "coolest", "cooperative", "cooperatively", "cornerstone", "correct", "correctly", "cost-effective", "cost-saving", "counter-attack", "counter-attacks", "courage", "courageous", "courageously", "courageousness", "courteous", "courtly", "covenant", "cozy", "creative", "credence", "credible", "crisp", "crisper", "cure", "cure-all", "cushy", "cute", "cuteness", "danke", "danken", "daring", "daringly", "darling", "dashing", "dauntless", "dawn", "dazzle", "dazzled", "dazzling", "dead-cheap", "dead-on", "decency", "decent", "decisive", "decisiveness", "dedicated", "defeat", "defeated", "defeating", "defeats", "defender", "deference", "deft", "deginified", "delectable", "delicacy", "delicate", "delicious", "delight", "delighted", "delightful", "delightfully", "delightfulness", "dependable", "dependably", "deservedly", "deserving", "desirable", "desiring", "desirous", "destiny", "detachable", "devout", "dexterous", "dexterously", "dextrous", "dignified", "dignify", "dignity", "diligence", "diligent", "diligently", "diplomatic", "dirt-cheap", "distinction", "distinctive", "distinguished", "diversified", "divine", "divinely", "dominate", "dominated", "dominates", "dote", "dotingly", "doubtless", "dreamland", "dumbfounded", "dumbfounding", "dummy-proof", "durable", "dynamic", "eager", "eagerly", "eagerness", "earnest", "earnestly", "earnestness", "ease", "eased", "eases", "easier", "easiest", "easiness", "easing", "easy", "easy-to-use", "easygoing", "ebullience", "ebullient", "ebulliently", "ecenomical", "economical", "ecstasies", "ecstasy", "ecstatic", "ecstatically", "edify", "educated", "effective", "effectively", "effectiveness", "effectual", "efficacious", "efficient", "efficiently", "effortless", "effortlessly", "effusion", "effusive", "effusively", "effusiveness", "elan", "elate", "elated", "elatedly", "elation", "electrify", "elegance", "elegant", "elegantly", "elevate", "elite", "eloquence", "eloquent", "eloquently", "embolden", "eminence", "eminent", "empathize", "empathy", "empower", "empowerment", "enchant", "enchanted", "enchanting", "enchantingly", "encourage", "encouragement", "encouraging", "encouragingly", "endear", "endearing", "endorse", "endorsed", "endorsement", "endorses", "endorsing", "energetic", "energize", "energy-efficient", "energy-saving", "engaging", "engrossing", "enhance", "enhanced", "enhancement", "enhances", "enjoy", "enjoyable", "enjoyably", "enjoyed", "enjoying", "enjoyment", "enjoys", "enlighten", "enlightenment", "enliven", "ennoble", "enough", "enrapt", "enrapture", "enraptured", "enrich", "enrichment", "enterprising", "entertain", "entertaining", "entertains", "enthral", "enthrall", "enthralled", "enthuse", "enthusiasm", "enthusiast", "enthusiastic", "enthusiastically", "entice", "enticed", "enticing", "enticingly", "entranced", "entrancing", "entrust", "enviable", "enviably", "envious", "enviously", "enviousness", "envy", "equitable", "ergonomical", "err-free", "erudite", "ethical", "eulogize", "euphoria", "euphoric", "euphorically", "evaluative", "evenly", "eventful", "everlasting", "evocative", "exalt", "exaltation", "exalted", "exaltedly", "exalting", "exaltingly", "examplar", "examplary", "excallent", "exceed", "exceeded", "exceeding", "exceedingly", "exceeds", "excel", "exceled", "excelent", "excellant", "excelled", "excellence", "excellency", "excellent", "excellently", "excels", "exceptional", "exceptionally", "excite", "excited", "excitedly", "excitedness", "excitement", "excites", "exciting", "excitingly", "exellent", "exemplar", "exemplary", "exhilarate", "exhilarating", "exhilaratingly", "exhilaration", "exonerate", "expansive", "expeditiously", "expertly", "exquisite", "exquisitely", "extol", "extoll", "extraordinarily", "extraordinary", "exuberance", "exuberant", "exuberantly", "exult", "exultant", "exultation", "exultingly", "eye-catch", "eye-catching", "eyecatch", "eyecatching", "fabulous", "fabulously", "facilitate", "fair", "fairly", "fairness", "faith", "faithful", "faithfully", "faithfulness", "fame", "famed", "famous", "famously", "fancier", "fancinating", "fancy", "fanfare", "fans", "fantastic", "fantastically", "fascinate", "fascinating", "fascinatingly", "fascination", "fashionable", "fashionably", "fast", "fast-growing", "fast-paced", "faster", "fastest", "fastest-growing", "faultless", "fav", "fave", "favor", "favorable", "favored", "favorite", "favorited", "favour", "fearless", "fearlessly", "feasible", "feasibly", "feat", "feature-rich", "fecilitous", "feisty", "felicitate", "felicitous", "felicity", "fertile", "fervent", "fervently", "fervid", "fervidly", "fervor", "festive", "fidelity", "fiery", "fine", "fine-looking", "finely", "finer", "finest", "firmer", "first-class", "first-in-class", "first-rate", "flashy", "flatter", "flattering", "flatteringly", "flawless", "flawlessly", "flexibility", "flexible", "flourish", "flourishing", "fluent", "flutter", "fond", "fondly", "fondness", "foolproof", "foremost", "foresight", "formidable", "fortitude", "fortuitous", "fortuitously", "fortunate", "fortunately", "fortune", "fragrant", "free", "freed", "freedom", "freedoms", "fresh", "fresher", "freshest", "friendliness", "friendly", "frolic", "frugal", "fruitful", "ftw", "fulfillment", "fun", "futurestic", "futuristic", "gaiety", "gaily", "gain", "gained", "gainful", "gainfully", "gaining", "gains", "gallant", "gallantly", "galore", "geekier", "geeky", "gem", "gems", "generosity", "generous", "generously", "genial", "genius", "gentle", "gentlest", "genuine", "gifted", "glad", "gladden", "gladly", "gladness", "glamorous", "glee", "gleeful", "gleefully", "glimmer", "glimmering", "glisten", "glistening", "glitter", "glitz", "glorify", "glorious", "gloriously", "glory", "glow", "glowing", "glowingly", "god-given", "god-send", "godlike", "godsend", "gold", "golden", "good", "goodly", "goodness", "goodwill", "goood", "gooood", "gorgeous", "gorgeously", "grace", "graceful", "gracefully", "gracious", "graciously", "graciousness", "grand", "grandeur", "grateful", "gratefully", "gratification", "gratified", "gratifies", "gratify", "gratifying", "gratifyingly", "gratitude", "great", "greatest", "greatness", "grin", "groundbreaking", "guarantee", "guidance", "guiltless", "gumption", "gush", "gusto", "gutsy", "hail", "halcyon", "hale", "hallmark", "hallmarks", "hallowed", "handier", "handily", "hands-down", "handsome", "handsomely", "handy", "happier", "happily", "happiness", "happy", "hard-working", "hardier", "hardy", "harmless", "harmonious", "harmoniously", "harmonize", "harmony", "headway", "heal", "healthful", "healthy", "hearten", "heartening", "heartfelt", "heartily", "heartwarming", "heaven", "heavenly", "helped", "helpful", "helping", "hero", "heroic", "heroically", "heroine", "heroize", "heros", "high-quality", "high-spirited", "hilarious", "holy", "homage", "honest", "honesty", "honor", "honorable", "honored", "honoring", "hooray", "hopeful", "hospitable", "hot", "hotcake", "hotcakes", "hottest", "hug", "humane", "humble", "humility", "humor", "humorous", "humorously", "humour", "humourous", "ideal", "idealize", "ideally", "idol", "idolize", "idolized", "idyllic", "illuminate", "illuminati", "illuminating", "illumine", "illustrious", "ilu", "imaculate", "imaginative", "immaculate", "immaculately", "immense", "impartial", "impartiality", "impartially", "impassioned", "impeccable", "impeccably", "important", "impress", "impressed", "impresses", "impressive", "impressively", "impressiveness", "improve", "improved", "improvement", "improvements", "improves", "improving", "incredible", "incredibly", "indebted", "individualized", "indulgence", "indulgent", "industrious", "inestimable", "inestimably", "inexpensive", "infallibility", "infallible", "infallibly", "influential", "ingenious", "ingeniously", "ingenuity", "ingenuous", "ingenuously", "innocuous", "innovation", "innovative", "inpressed", "insightful", "insightfully", "inspiration", "inspirational", "inspire", "inspiring", "instantly", "instructive", "instrumental", "integral", "integrated", "intelligence", "intelligent", "intelligible", "interesting", "interests", "intimacy", "intimate", "intricate", "intrigue", "intriguing", "intriguingly", "intuitive", "invaluable", "invaluablely", "inventive", "invigorate", "invigorating", "invincibility", "invincible", "inviolable", "inviolate", "invulnerable", "irreplaceable", "irreproachable", "irresistible", "irresistibly", "issue-free", "jaw-droping", "jaw-dropping", "jollify", "jolly", "jovial", "joy", "joyful", "joyfully", "joyous", "joyously", "jubilant", "jubilantly", "jubilate", "jubilation", "jubiliant", "judicious", "justly", "keen", "keenly", "keenness", "kid-friendly", "kindliness", "kindly", "kindness", "knowledgeable", "kudos", "large-capacity", "laud", "laudable", "laudably", "lavish", "lavishly", "law-abiding", "lawful", "lawfully", "lead", "leading", "leads", "lean", "led", "legendary", "leverage", "levity", "liberate", "liberation", "liberty", "lifesaver", "light-hearted", "lighter", "likable", "like", "liked", "likes", "liking", "lionhearted", "lively", "logical", "long-lasting", "lovable", "lovably", "love", "loved", "loveliness", "lovely", "lover", "loves", "loving", "low-cost", "low-price", "low-priced", "low-risk", "lower-priced", "loyal", "loyalty", "lucid", "lucidly", "luck", "luckier", "luckiest", "luckiness", "lucky", "lucrative", "luminous", "lush", "luster", "lustrous", "luxuriant", "luxuriate", "luxurious", "luxuriously", "luxury", "lyrical", "magic", "magical", "magnanimous", "magnanimously", "magnificence", "magnificent", "magnificently", "majestic", "majesty", "manageable", "maneuverable", "marvel", "marveled", "marvelled", "marvellous", "marvelous", "marvelously", "marvelousness", "marvels", "master", "masterful", "masterfully", "masterpiece", "masterpieces", "masters", "mastery", "matchless", "mature", "maturely", "maturity", "meaningful", "memorable", "merciful", "mercifully", "mercy", "merit", "meritorious", "merrily", "merriment", "merriness", "merry", "mesmerize", "mesmerized", "mesmerizes", "mesmerizing", "mesmerizingly", "meticulous", "meticulously", "mightily", "mighty", "mind-blowing", "miracle", "miracles", "miraculous", "miraculously", "miraculousness", "modern", "modest", "modesty", "momentous", "monumental", "monumentally", "morality", "motivated", "multi-purpose", "navigable", "neat", "neatest", "neatly", "nice", "nicely", "nicer", "nicest", "nifty", "nimble", "noble", "nobly", "noiseless", "non-violence", "non-violent", "notably", "noteworthy", "nourish", "nourishing", "nourishment", "novelty", "nurturing", "oasis", "obsession", "obsessions", "obtainable", "openly", "openness", "optimal", "optimism", "optimistic", "opulent", "orderly", "originality", "outdo", "outdone", "outperform", "outperformed", "outperforming", "outperforms", "outshine", "outshone", "outsmart", "outstanding", "outstandingly", "outstrip", "outwit", "ovation", "overjoyed", "overtake", "overtaken", "overtakes", "overtaking", "overtook", "overture", "pain-free", "painless", "painlessly", "palatial", "pamper", "pampered", "pamperedly", "pamperedness", "pampers", "panoramic", "paradise", "paramount", "pardon", "passion", "passionate", "passionately", "patience", "patient", "patiently", "patriot", "patriotic", "peace", "peaceable", "peaceful", "peacefully", "peacekeepers", "peach", "peerless", "pep", "pepped", "pepping", "peppy", "peps", "perfect", "perfection", "perfectly", "permissible", "perseverance", "persevere", "personages", "personalized", "phenomenal", "phenomenally", "picturesque", "piety", "pinnacle", "playful", "playfully", "pleasant", "pleasantly", "pleased", "pleases", "pleasing", "pleasingly", "pleasurable", "pleasurably", "pleasure", "plentiful", "pluses", "plush", "plusses", "poetic", "poeticize", "poignant", "poise", "poised", "polished", "polite", "politeness", "popular", "portable", "posh", "positive", "positively", "positives", "powerful", "powerfully", "praise", "praiseworthy", "praising", "pre-eminent", "precious", "precise", "precisely", "preeminent", "prefer", "preferable", "preferably", "prefered", "preferes", "preferring", "prefers", "premier", "prestige", "prestigious", "prettily", "pretty", "priceless", "pride", "principled", "privilege", "privileged", "prize", "proactive", "problem-free", "problem-solver", "prodigious", "prodigiously", "prodigy", "productive", "productively", "proficient", "proficiently", "profound", "profoundly", "profuse", "profusion", "progress", "progressive", "prolific", "prominence", "prominent", "promise", "promised", "promises", "promising", "promoter", "prompt", "promptly", "proper", "properly", "propitious", "propitiously", "pros", "prosper", "prosperity", "prosperous", "prospros", "protect", "protection", "protective", "proud", "proven", "proves", "providence", "proving", "prowess", "prudence", "prudent", "prudently", "punctual", "pure", "purify", "purposeful", "quaint", "qualified", "qualify", "quicker", "quiet", "quieter", "radiance", "radiant", "rapid", "rapport", "rapt", "rapture", "raptureous", "raptureously", "rapturous", "rapturously", "rational", "razor-sharp", "reachable", "readable", "readily", "ready", "reaffirm", "reaffirmation", "realistic", "realizable", "reasonable", "reasonably", "reasoned", "reassurance", "reassure", "receptive", "reclaim", "recomend", "recommend", "recommendation", "recommendations", "recommended", "reconcile", "reconciliation", "record-setting", "recover", "recovery", "rectification", "rectify", "rectifying", "redeem", "redeeming", "redemption", "refine", "refined", "refinement", "reform", "reformed", "reforming", "reforms", "refresh", "refreshed", "refreshing", "refund", "refunded", "regal", "regally", "regard", "rejoice", "rejoicing", "rejoicingly", "rejuvenate", "rejuvenated", "rejuvenating", "relaxed", "relent", "reliable", "reliably", "relief", "relish", "remarkable", "remarkably", "remedy", "remission", "remunerate", "renaissance", "renewed", "renown", "renowned", "replaceable", "reputable", "reputation", "resilient", "resolute", "resound", "resounding", "resourceful", "resourcefulness", "respect", "respectable", "respectful", "respectfully", "respite", "resplendent", "responsibly", "responsive", "restful", "restored", "restructure", "restructured", "restructuring", "retractable", "revel", "revelation", "revere", "reverence", "reverent", "reverently", "revitalize", "revival", "revive", "revives", "revolutionary", "revolutionize", "revolutionized", "revolutionizes", "reward", "rewarding", "rewardingly", "rich", "richer", "richly", "richness", "right", "righten", "righteous", "righteously", "righteousness", "rightful", "rightfully", "rightly", "rightness", "risk-free", "robust", "rock-star", "rock-stars", "rockstar", "rockstars", "romantic", "romantically", "romanticize", "roomier", "roomy", "rosy", "safe", "safely", "sagacity", "sagely", "saint", "saintliness", "saintly", "salutary", "salute", "sane", "satisfactorily", "satisfactory", "satisfied", "satisfies", "satisfy", "satisfying", "satisified", "saver", "savings", "savior", "savvy", "scenic", "seamless", "seasoned", "secure", "securely", "selective", "self-determination", "self-respect", "self-satisfaction", "self-sufficiency", "self-sufficient", "sensation", "sensational", "sensationally", "sensations", "sensible", "sensibly", "sensitive", "serene", "serenity", "sexy", "sharp", "sharper", "sharpest", "shimmering", "shimmeringly", "shine", "shiny", "significant", "silent", "simpler", "simplest", "simplified", "simplifies", "simplify", "simplifying", "sincere", "sincerely", "sincerity", "skill", "skilled", "skillful", "skillfully", "slammin", "sleek", "slick", "smart", "smarter", "smartest", "smartly", "smile", "smiles", "smiling", "smilingly", "smitten", "smooth", "smoother", "smoothes", "smoothest", "smoothly", "snappy", "snazzy", "sociable", "soft", "softer", "solace", "solicitous", "solicitously", "solid", "solidarity", "soothe", "soothingly", "sophisticated", "soulful", "soundly", "soundness", "spacious", "sparkle", "sparkling", "spectacular", "spectacularly", "speedily", "speedy", "spellbind", "spellbinding", "spellbindingly", "spellbound", "spirited", "spiritual", "splendid", "splendidly", "splendor", "spontaneous", "sporty", "spotless", "sprightly", "stability", "stabilize", "stable", "stainless", "standout", "state-of-the-art", "stately", "statuesque", "staunch", "staunchly", "staunchness", "steadfast", "steadfastly", "steadfastness", "steadiest", "steadiness", "steady", "stellar", "stellarly", "stimulate", "stimulates", "stimulating", "stimulative", "stirringly", "straighten", "straightforward", "streamlined", "striking", "strikingly", "striving", "strong", "stronger", "strongest", "stunned", "stunning", "stunningly", "stupendous", "stupendously", "sturdier", "sturdy", "stylish", "stylishly", "stylized", "suave", "suavely", "sublime", "subsidize", "subsidized", "subsidizes", "subsidizing", "substantive", "succeed", "succeeded", "succeeding", "succeeds", "succes", "success", "successes", "successful", "successfully", "suffice", "sufficed", "suffices", "sufficient", "sufficiently", "suitable", "sumptuous", "sumptuously", "sumptuousness", "super", "superb", "superbly", "superior", "superiority", "supple", "support", "supported", "supporter", "supporting", "supportive", "supports", "supremacy", "supreme", "supremely", "supurb", "supurbly", "surmount", "surpass", "surreal", "survival", "survivor", "sustainability", "sustainable", "swank", "swankier", "swankiest", "swanky", "sweeping", "sweet", "sweeten", "sweetheart", "sweetly", "sweetness", "swift", "swiftness", "talent", "talented", "talents", "tantalize", "tantalizing", "tantalizingly", "tempt", "tempting", "temptingly", "tenacious", "tenaciously", "tenacity", "tender", "tenderly", "terrific", "terrifically", "thank", "thankful", "thinner", "thoughtful", "thoughtfully", "thoughtfulness", "thrift", "thrifty", "thrill", "thrilled", "thrilling", "thrillingly", "thrills", "thrive", "thriving", "thumb-up", "thumbs-up", "tickle", "tidy", "time-honored", "timely", "tingle", "titillate", "titillating", "titillatingly", "togetherness", "tolerable", "toll-free", "top", "top-notch", "top-quality", "topnotch", "tops", "tough", "tougher", "toughest", "traction", "tranquil", "tranquility", "transparent", "treasure", "tremendously", "trendy", "triumph", "triumphal", "triumphant", "triumphantly", "trivially", "trophy", "trouble-free", "trump", "trumpet", "trust", "trusted", "trusting", "trustingly", "trustworthiness", "trustworthy", "trusty", "truthful", "truthfully", "truthfulness", "twinkly", "ultra-crisp", "unabashed", "unabashedly", "unaffected", "unassailable", "unbeatable", "unbiased", "unbound", "uncomplicated", "unconditional", "undamaged", "undaunted", "understandable", "undisputable", "undisputably", "undisputed", "unencumbered", "unequivocal", "unequivocally", "unfazed", "unfettered", "unforgettable", "unity", "unlimited", "unmatched", "unparalleled", "unquestionable", "unquestionably", "unreal", "unrestricted", "unrivaled", "unselfish", "unwavering", "upbeat", "upgradable", "upgradeable", "upgraded", "upheld", "uphold", "uplift", "uplifting", "upliftingly", "upliftment", "upscale", "usable", "useable", "useful", "user-friendly", "user-replaceable", "valiant", "valiantly", "valor", "valuable", "variety", "venerate", "verifiable", "veritable", "versatile", "versatility", "vibrant", "vibrantly", "victorious", "victory", "viewable", "vigilance", "vigilant", "virtue", "virtuous", "virtuously", "visionary", "vivacious", "vivid", "vouch", "vouchsafe", "warm", "warmer", "warmhearted", "warmly", "warmth", "wealthy", "welcome", "well", "well-backlit", "well-balanced", "well-behaved", "well-being", "well-bred", "well-connected", "well-educated", "well-established", "well-informed", "well-intentioned", "well-known", "well-made", "well-managed", "well-mannered", "well-positioned", "well-received", "well-regarded", "well-rounded", "well-run", "well-wishers", "wellbeing", "whoa", "wholeheartedly", "wholesome", "whooa", "whoooa", "wieldy", "willing", "willingly", "willingness", "win", "windfall", "winnable", "winner", "winners", "winning", "wins", "wisdom", "wise", "wisely", "witty", "won", "wonder", "wonderful", "wonderfully", "wonderous", "wonderously", "wonders", "wondrous", "woo", "work", "workable", "worked", "works", "world-famous", "worth", "worth-while", "worthiness", "worthwhile", "worthy", "wow", "wowed", "wowing", "wows", "yay", "youthful", "zeal", "zenith", "zest", "zippy"]

  negativeWords = ["2-faced", "2-faces", "abnormal", "abolish", "abominable", "abominably", "abominate", "abomination", "abort", "aborted", "aborts", "abrade", "abrasive", "abrupt", "abruptly", "abscond", "absence", "absent-minded", "absentee", "absurd", "absurdity", "absurdly", "absurdness", "abuse", "abused", "abuses", "abusive", "abysmal", "abysmally", "abyss", "accidental", "accost", "accursed", "accusation", "accusations", "accuse", "accuses", "accusing", "accusingly", "acerbate", "acerbic", "acerbically", "ache", "ached", "aches", "achey", "aching", "acrid", "acridly", "acridness", "acrimonious", "acrimoniously", "acrimony", "adamant", "adamantly", "addict", "addicted", "addicting", "addicts", "admonish", "admonisher", "admonishingly", "admonishment", "admonition", "adulterate", "adulterated", "adulteration", "adulterier", "adversarial", "adversary", "adverse", "adversity", "afflict", "affliction", "afflictive", "affront", "afraid", "aggravate", "aggravating", "aggravation", "aggression", "aggressive", "aggressiveness", "aggressor", "aggrieve", "aggrieved", "aggrivation", "aghast", "agonies", "agonize", "agonizing", "agonizingly", "agony", "aground", "ail", "ailing", "ailment", "aimless", "alarm", "alarmed", "alarming", "alarmingly", "alienate", "alienated", "alienation", "allegation", "allegations", "allege", "allergic", "allergies", "allergy", "aloof", "altercation", "ambiguity", "ambiguous", "ambivalence", "ambivalent", "ambush", "amiss", "amputate", "anarchism", "anarchist", "anarchistic", "anarchy", "anemic", "anger", "angrily", "angriness", "angry", "anguish", "animosity", "annihilate", "annihilation", "annoy", "annoyance", "annoyances", "annoyed", "annoying", "annoyingly", "annoys", "anomalous", "anomaly", "antagonism", "antagonist", "antagonistic", "antagonize", "anti-", "anti-american", "anti-israeli", "anti-occupation", "anti-proliferation", "anti-semites", "anti-social", "anti-us", "anti-white", "antipathy", "antiquated", "antithetical", "anxieties", "anxiety", "anxious", "anxiously", "anxiousness", "apathetic", "apathetically", "apathy", "apocalypse", "apocalyptic", "apologist", "apologists", "appal", "appall", "appalled", "appalling", "appallingly", "apprehension", "apprehensions", "apprehensive", "apprehensively", "arbitrary", "arcane", "archaic", "arduous", "arduously", "argumentative", "arrogance", "arrogant", "arrogantly", "ashamed", "asinine", "asininely", "asinininity", "askance", "asperse", "aspersion", "aspersions", "assail", "assassin", "assassinate", "assault", "assult", "astray", "asunder", "atrocious", "atrocities", "atrocity", "atrophy", "attack", "attacks", "audacious", "audaciously", "audaciousness", "audacity", "audiciously", "austere", "authoritarian", "autocrat", "autocratic", "avalanche", "avarice", "avaricious", "avariciously", "avenge", "averse", "aversion", "aweful", "awful", "awfully", "awfulness", "awkward", "awkwardness", "ax", "babble", "back-logged", "back-wood", "back-woods", "backache", "backaches", "backaching", "backbite", "backbiting", "backward", "backwardness", "backwood", "backwoods", "bad", "badly", "baffle", "baffled", "bafflement", "baffling", "bait", "balk", "banal", "banalize", "bane", "banish", "banishment", "bankrupt", "barbarian", "barbaric", "barbarically", "barbarity", "barbarous", "barbarously", "barren", "baseless", "bash", "bashed", "bashful", "bashing", "bastard", "bastards", "battered", "battering", "batty", "bearish", "beastly", "bedlam", "bedlamite", "befoul", "beg", "beggar", "beggarly", "begging", "beguile", "belabor", "belated", "beleaguer", "belie", "belittle", "belittled", "belittling", "bellicose", "belligerence", "belligerent", "belligerently", "bemoan", "bemoaning", "bemused", "bent", "berate", "bereave", "bereavement", "bereft", "berserk", "beseech", "beset", "besiege", "besmirch", "bestial", "betray", "betrayal", "betrayals", "betrayer", "betraying", "betrays", "bewail", "beware", "bewilder", "bewildered", "bewildering", "bewilderingly", "bewilderment", "bewitch", "bias", "biased", "biases", "bicker", "bickering", "bid-rigging", "bigotries", "bigotry", "bitch", "bitchy", "biting", "bitingly", "bitter", "bitterly", "bitterness", "bizarre", "blab", "blabber", "blackmail", "blah", "blame", "blameworthy", "bland", "blandish", "blaspheme", "blasphemous", "blasphemy", "blasted", "blatant", "blatantly", "blather", "bleak", "bleakly", "bleakness", "bleed", "bleeding", "bleeds", "blemish", "blind", "blinding", "blindingly", "blindside", "blister", "blistering", "bloated", "blockage", "blockhead", "bloodshed", "bloodthirsty", "bloody", "blotchy", "blow", "blunder", "blundering", "blunders", "blunt", "blur", "bluring", "blurred", "blurring", "blurry", "blurs", "blurt", "boastful", "boggle", "bogus", "boil", "boiling", "boisterous", "bomb", "bombard", "bombardment", "bombastic", "bondage", "bonkers", "bore", "bored", "boredom", "bores", "boring", "botch", "bother", "bothered", "bothering", "bothers", "bothersome", "bowdlerize", "boycott", "braggart", "bragger", "brainless", "brainwash", "brash", "brashly", "brashness", "brat", "bravado", "brazen", "brazenly", "brazenness", "breach", "break", "break-up", "break-ups", "breakdown", "breaking", "breaks", "breakup", "breakups", "bribery", "brimstone", "bristle", "brittle", "broke", "broken", "broken-hearted", "brood", "browbeat", "bruise", "bruised", "bruises", "bruising", "brusque", "brutal", "brutalising", "brutalities", "brutality", "brutalize", "brutalizing", "brutally", "brute", "brutish", "bs", "buckle", "bug", "bugging", "buggy", "bugs", "bulkier", "bulkiness", "bulky", "bulkyness", "bull****", "bull----", "bullies", "bullshit", "bullshyt", "bully", "bullying", "bullyingly", "bum", "bump", "bumped", "bumping", "bumpping", "bumps", "bumpy", "bungle", "bungler", "bungling", "bunk", "burden", "burdensome", "burdensomely", "burn", "burned", "burning", "burns", "bust", "busts", "busybody", "butcher", "butchery", "buzzing", "byzantine", "cackle", "calamities", "calamitous", "calamitously", "calamity", "callous", "calumniate", "calumniation", "calumnies", "calumnious", "calumniously", "calumny", "cancer", "cancerous", "cannibal", "cannibalize", "capitulate", "capricious", "capriciously", "capriciousness", "capsize", "careless", "carelessness", "caricature", "carnage", "carp", "cartoonish", "cash-strapped", "castigate", "castrated", "casualty", "cataclysm", "cataclysmal", "cataclysmic", "cataclysmically", "catastrophe", "catastrophes", "catastrophic", "catastrophically", "catastrophies", "caustic", "caustically", "cautionary", "cave", "censure", "chafe", "chaff", "chagrin", "challenging", "chaos", "chaotic", "chasten", "chastise", "chastisement", "chatter", "chatterbox", "cheap", "cheapen", "cheaply", "cheat", "cheated", "cheater", "cheating", "cheats", "checkered", "cheerless", "cheesy", "chide", "childish", "chill", "chilly", "chintzy", "choke", "choleric", "choppy", "chore", "chronic", "chunky", "clamor", "clamorous", "clash", "cliche", "cliched", "clique", "clog", "clogged", "clogs", "cloud", "clouding", "cloudy", "clueless", "clumsy", "clunky", "coarse", "cocky", "coerce", "coercion", "coercive", "cold", "coldly", "collapse", "collude", "collusion", "combative", "combust", "comical", "commiserate", "commonplace", "commotion", "commotions", "complacent", "complain", "complained", "complaining", "complains", "complaint", "complaints", "complex", "complicated", "complication", "complicit", "compulsion", "compulsive", "concede", "conceded", "conceit", "conceited", "concen", "concens", "concern", "concerned", "concerns", "concession", "concessions", "condemn", "condemnable", "condemnation", "condemned", "condemns", "condescend", "condescending", "condescendingly", "condescension", "confess", "confession", "confessions", "confined", "conflict", "conflicted", "conflicting", "conflicts", "confound", "confounded", "confounding", "confront", "confrontation", "confrontational", "confuse", "confused", "confuses", "confusing", "confusion", "confusions", "congested", "congestion", "cons", "conscons", "conservative", "conspicuous", "conspicuously", "conspiracies", "conspiracy", "conspirator", "conspiratorial", "conspire", "consternation", "contagious", "contaminate", "contaminated", "contaminates", "contaminating", "contamination", "contempt", "contemptible", "contemptuous", "contemptuously", "contend", "contention", "contentious", "contort", "contortions", "contradict", "contradiction", "contradictory", "contrariness", "contravene", "contrive", "contrived", "controversial", "controversy", "convoluted", "corrode", "corrosion", "corrosions", "corrosive", "corrupt", "corrupted", "corrupting", "corruption", "corrupts", "corruptted", "costlier", "costly", "counter-productive", "counterproductive", "coupists", "covetous", "coward", "cowardly", "crabby", "crack", "cracked", "cracks", "craftily", "craftly", "crafty", "cramp", "cramped", "cramping", "cranky", "crap", "crappy", "craps", "crash", "crashed", "crashes", "crashing", "crass", "craven", "cravenly", "craze", "crazily", "craziness", "crazy", "creak", "creaking", "creaks", "credulous", "creep", "creeping", "creeps", "creepy", "crept", "crime", "criminal", "cringe", "cringed", "cringes", "cripple", "crippled", "cripples", "crippling", "crisis", "critic", "critical", "criticism", "criticisms", "criticize", "criticized", "criticizing", "critics", "cronyism", "crook", "crooked", "crooks", "crowded", "crowdedness", "crude", "cruel", "crueler", "cruelest", "cruelly", "cruelness", "cruelties", "cruelty", "crumble", "crumbling", "crummy", "crumple", "crumpled", "crumples", "crush", "crushed", "crushing", "cry", "culpable", "culprit", "cumbersome", "cunt", "cunts", "cuplrit", "curse", "cursed", "curses", "curt", "cuss", "cussed", "cutthroat", "cynical", "cynicism", "d*mn", "damage", "damaged", "damages", "damaging", "damn", "damnable", "damnably", "damnation", "damned", "damning", "damper", "danger", "dangerous", "dangerousness", "dark", "darken", "darkened", "darker", "darkness", "dastard", "dastardly", "daunt", "daunting", "dauntingly", "dawdle", "daze", "dazed", "dead", "deadbeat", "deadlock", "deadly", "deadweight", "deaf", "dearth", "death", "debacle", "debase", "debasement", "debaser", "debatable", "debauch", "debaucher", "debauchery", "debilitate", "debilitating", "debility", "debt", "debts", "decadence", "decadent", "decay", "decayed", "deceit", "deceitful", "deceitfully", "deceitfulness", "deceive", "deceiver", "deceivers", "deceiving", "deception", "deceptive", "deceptively", "declaim", "decline", "declines", "declining", "decrement", "decrepit", "decrepitude", "decry", "defamation", "defamations", "defamatory", "defame", "defect", "defective", "defects", "defensive", "defiance", "defiant", "defiantly", "deficiencies", "deficiency", "deficient", "defile", "defiler", "deform", "deformed", "defrauding", "defunct", "defy", "degenerate", "degenerately", "degeneration", "degradation", "degrade", "degrading", "degradingly", "dehumanization", "dehumanize", "deign", "deject", "dejected", "dejectedly", "dejection", "delay", "delayed", "delaying", "delays", "delinquency", "delinquent", "delirious", "delirium", "delude", "deluded", "deluge", "delusion", "delusional", "delusions", "demean", "demeaning", "demise", "demolish", "demolisher", "demon", "demonic", "demonize", "demonized", "demonizes", "demonizing", "demoralize", "demoralizing", "demoralizingly", "denial", "denied", "denies", "denigrate", "denounce", "dense", "dent", "dented", "dents", "denunciate", "denunciation", "denunciations", "deny", "denying", "deplete", "deplorable", "deplorably", "deplore", "deploring", "deploringly", "deprave", "depraved", "depravedly", "deprecate", "depress", "depressed", "depressing", "depressingly", "depression", "depressions", "deprive", "deprived", "deride", "derision", "derisive", "derisively", "derisiveness", "derogatory", "desecrate", "desert", "desertion", "desiccate", "desiccated", "desititute", "desolate", "desolately", "desolation", "despair", "despairing", "despairingly", "desperate", "desperately", "desperation", "despicable", "despicably", "despise", "despised", "despoil", "despoiler", "despondence", "despondency", "despondent", "despondently", "despot", "despotic", "despotism", "destabilisation", "destains", "destitute", "destitution", "destroy", "destroyer", "destruction", "destructive", "desultory", "deter", "deteriorate", "deteriorating", "deterioration", "deterrent", "detest", "detestable", "detestably", "detested", "detesting", "detests", "detract", "detracted", "detracting", "detraction", "detracts", "detriment", "detrimental", "devastate", "devastated", "devastates", "devastating", "devastatingly", "devastation", "deviate", "deviation", "devil", "devilish", "devilishly", "devilment", "devilry", "devious", "deviously", "deviousness", "devoid", "diabolic", "diabolical", "diabolically", "diametrically", "diappointed", "diatribe", "diatribes", "dick", "dictator", "dictatorial", "die", "die-hard", "died", "dies", "difficult", "difficulties", "difficulty", "diffidence", "dilapidated", "dilemma", "dilly-dally", "dim", "dimmer", "din", "ding", "dings", "dinky", "dire", "direly", "direness", "dirt", "dirtbag", "dirtbags", "dirts", "dirty", "disable", "disabled", "disaccord", "disadvantage", "disadvantaged", "disadvantageous", "disadvantages", "disaffect", "disaffected", "disaffirm", "disagree", "disagreeable", "disagreeably", "disagreed", "disagreeing", "disagreement", "disagrees", "disallow", "disapointed", "disapointing", "disapointment", "disappoint", "disappointed", "disappointing", "disappointingly", "disappointment", "disappointments", "disappoints", "disapprobation", "disapproval", "disapprove", "disapproving", "disarm", "disarray", "disaster", "disasterous", "disastrous", "disastrously", "disavow", "disavowal", "disbelief", "disbelieve", "disbeliever", "disclaim", "discombobulate", "discomfit", "discomfititure", "discomfort", "discompose", "disconcert", "disconcerted", "disconcerting", "disconcertingly", "disconsolate", "disconsolately", "disconsolation", "discontent", "discontented", "discontentedly", "discontinued", "discontinuity", "discontinuous", "discord", "discordance", "discordant", "discountenance", "discourage", "discouragement", "discouraging", "discouragingly", "discourteous", "discourteously", "discoutinous", "discredit", "discrepant", "discriminate", "discrimination", "discriminatory", "disdain", "disdained", "disdainful", "disdainfully", "disfavor", "disgrace", "disgraced", "disgraceful", "disgracefully", "disgruntle", "disgruntled", "disgust", "disgusted", "disgustedly", "disgustful", "disgustfully", "disgusting", "disgustingly", "dishearten", "disheartening", "dishearteningly", "dishonest", "dishonestly", "dishonesty", "dishonor", "dishonorable", "dishonorablely", "disillusion", "disillusioned", "disillusionment", "disillusions", "disinclination", "disinclined", "disingenuous", "disingenuously", "disintegrate", "disintegrated", "disintegrates", "disintegration", "disinterest", "disinterested", "dislike", "disliked", "dislikes", "disliking", "dislocated", "disloyal", "disloyalty", "dismal", "dismally", "dismalness", "dismay", "dismayed", "dismaying", "dismayingly", "dismissive", "dismissively", "disobedience", "disobedient", "disobey", "disoobedient", "disorder", "disordered", "disorderly", "disorganized", "disorient", "disoriented", "disown", "disparage", "disparaging", "disparagingly", "dispensable", "dispirit", "dispirited", "dispiritedly", "dispiriting", "displace", "displaced", "displease", "displeased", "displeasing", "displeasure", "disproportionate", "disprove", "disputable", "dispute", "disputed", "disquiet", "disquieting", "disquietingly", "disquietude", "disregard", "disregardful", "disreputable", "disrepute", "disrespect", "disrespectable", "disrespectablity", "disrespectful", "disrespectfully", "disrespectfulness", "disrespecting", "disrupt", "disruption", "disruptive", "diss", "dissapointed", "dissappointed", "dissappointing", "dissatisfaction", "dissatisfactory", "dissatisfied", "dissatisfies", "dissatisfy", "dissatisfying", "dissed", "dissemble", "dissembler", "dissension", "dissent", "dissenter", "dissention", "disservice", "disses", "dissidence", "dissident", "dissidents", "dissing", "dissocial", "dissolute", "dissolution", "dissonance", "dissonant", "dissonantly", "dissuade", "dissuasive", "distains", "distaste", "distasteful", "distastefully", "distort", "distorted", "distortion", "distorts", "distract", "distracting", "distraction", "distraught", "distraughtly", "distraughtness", "distress", "distressed", "distressing", "distressingly", "distrust", "distrustful", "distrusting", "disturb", "disturbance", "disturbed", "disturbing", "disturbingly", "disunity", "disvalue", "divergent", "divisive", "divisively", "divisiveness", "dizzing", "dizzingly", "dizzy", "doddering", "dodgey", "dogged", "doggedly", "dogmatic", "doldrums", "domineer", "domineering", "donside", "doom", "doomed", "doomsday", "dope", "doubt", "doubtful", "doubtfully", "doubts", "douchbag", "douchebag", "douchebags", "downbeat", "downcast", "downer", "downfall", "downfallen", "downgrade", "downhearted", "downheartedly", "downhill", "downside", "downsides", "downturn", "downturns", "drab", "draconian", "draconic", "drag", "dragged", "dragging", "dragoon", "drags", "drain", "drained", "draining", "drains", "drastic", "drastically", "drawback", "drawbacks", "dread", "dreadful", "dreadfully", "dreadfulness", "dreary", "dripped", "dripping", "drippy", "drips", "drones", "droop", "droops", "drop-out", "drop-outs", "dropout", "dropouts", "drought", "drowning", "drunk", "drunkard", "drunken", "dubious", "dubiously", "dubitable", "dud", "dull", "dullard", "dumb", "dumbfound", "dump", "dumped", "dumping", "dumps", "dunce", "dungeon", "dungeons", "dupe", "dust", "dusty", "dwindling", "dying", "earsplitting", "eccentric", "eccentricity", "effigy", "effrontery", "egocentric", "egomania", "egotism", "egotistical", "egotistically", "egregious", "egregiously", "election-rigger", "elimination", "emaciated", "emasculate", "embarrass", "embarrassing", "embarrassingly", "embarrassment", "embattled", "embroil", "embroiled", "embroilment", "emergency", "emphatic", "emphatically", "emptiness", "encroach", "encroachment", "endanger", "enemies", "enemy", "enervate", "enfeeble", "enflame", "engulf", "enjoin", "enmity", "enrage", "enraged", "enraging", "enslave", "entangle", "entanglement", "entrap", "entrapment", "envious", "enviously", "enviousness", "epidemic", "equivocal", "erase", "erode", "erodes", "erosion", "err", "errant", "erratic", "erratically", "erroneous", "erroneously", "error", "errors", "eruptions", "escapade", "eschew", "estranged", "evade", "evasion", "evasive", "evil", "evildoer", "evils", "eviscerate", "exacerbate", "exagerate", "exagerated", "exagerates", "exaggerate", "exaggeration", "exasperate", "exasperated", "exasperating", "exasperatingly", "exasperation", "excessive", "excessively", "exclusion", "excoriate", "excruciating", "excruciatingly", "excuse", "excuses", "execrate", "exhaust", "exhausted", "exhaustion", "exhausts", "exhorbitant", "exhort", "exile", "exorbitant", "exorbitantance", "exorbitantly", "expel", "expensive", "expire", "expired", "explode", "exploit", "exploitation", "explosive", "expropriate", "expropriation", "expulse", "expunge", "exterminate", "extermination", "extinguish", "extort", "extortion", "extraneous", "extravagance", "extravagant", "extravagantly", "extremism", "extremist", "extremists", "eyesore", "f**k", "fabricate", "fabrication", "facetious", "facetiously", "fail", "failed", "failing", "fails", "failure", "failures", "faint", "fainthearted", "faithless", "fake", "fall", "fallacies", "fallacious", "fallaciously", "fallaciousness", "fallacy", "fallen", "falling", "fallout", "falls", "false", "falsehood", "falsely", "falsify", "falter", "faltered", "famine", "famished", "fanatic", "fanatical", "fanatically", "fanaticism", "fanatics", "fanciful", "far-fetched", "farce", "farcical", "farcical-yet-provocative", "farcically", "farfetched", "fascism", "fascist", "fastidious", "fastidiously", "fastuous", "fat", "fat-cat", "fat-cats", "fatal", "fatalistic", "fatalistically", "fatally", "fatcat", "fatcats", "fateful", "fatefully", "fathomless", "fatigue", "fatigued", "fatique", "fatty", "fatuity", "fatuous", "fatuously", "fault", "faults", "faulty", "fawningly", "faze", "fear", "fearful", "fearfully", "fears", "fearsome", "feckless", "feeble", "feeblely", "feebleminded", "feign", "feint", "fell", "felon", "felonious", "ferociously", "ferocity", "fetid", "fever", "feverish", "fevers", "fiasco", "fib", "fibber", "fickle", "fiction", "fictional", "fictitious", "fidget", "fidgety", "fiend", "fiendish", "fierce", "figurehead", "filth", "filthy", "finagle", "finicky", "fissures", "fist", "flabbergast", "flabbergasted", "flagging", "flagrant", "flagrantly", "flair", "flairs", "flak", "flake", "flakey", "flakieness", "flaking", "flaky", "flare", "flares", "flareup", "flareups", "flat-out", "flaunt", "flaw", "flawed", "flaws", "flee", "fleed", "fleeing", "fleer", "flees", "fleeting", "flicering", "flicker", "flickering", "flickers", "flighty", "flimflam", "flimsy", "flirt", "flirty", "floored", "flounder", "floundering", "flout", "fluster", "foe", "fool", "fooled", "foolhardy", "foolish", "foolishly", "foolishness", "forbid", "forbidden", "forbidding", "forceful", "foreboding", "forebodingly", "forfeit", "forged", "forgetful", "forgetfully", "forgetfulness", "forlorn", "forlornly", "forsake", "forsaken", "forswear", "foul", "foully", "foulness", "fractious", "fractiously", "fracture", "fragile", "fragmented", "frail", "frantic", "frantically", "franticly", "fraud", "fraudulent", "fraught", "frazzle", "frazzled", "freak", "freaking", "freakish", "freakishly", "freaks", "freeze", "freezes", "freezing", "frenetic", "frenetically", "frenzied", "frenzy", "fret", "fretful", "frets", "friction", "frictions", "fried", "friggin", "frigging", "fright", "frighten", "frightening", "frighteningly", "frightful", "frightfully", "frigid", "frost", "frown", "froze", "frozen", "fruitless", "fruitlessly", "frustrate", "frustrated", "frustrates", "frustrating", "frustratingly", "frustration", "frustrations", "fuck", "fucking", "fudge", "fugitive", "full-blown", "fulminate", "fumble", "fume", "fumes", "fundamentalism", "funky", "funnily", "funny", "furious", "furiously", "furor", "fury", "fuss", "fussy", "fustigate", "fusty", "futile", "futilely", "futility", "fuzzy", "gabble", "gaff", "gaffe", "gainsay", "gainsayer", "gall", "galling", "gallingly", "galls", "gangster", "gape", "garbage", "garish", "gasp", "gauche", "gaudy", "gawk", "gawky", "geezer", "genocide", "get-rich", "ghastly", "ghetto", "ghosting", "gibber", "gibberish", "gibe", "giddy", "gimmick", "gimmicked", "gimmicking", "gimmicks", "gimmicky", "glare", "glaringly", "glib", "glibly", "glitch", "glitches", "gloatingly", "gloom", "gloomy", "glower", "glum", "glut", "gnawing", "goad", "goading", "god-awful", "goof", "goofy", "goon", "gossip", "graceless", "gracelessly", "graft", "grainy", "grapple", "grate", "grating", "gravely", "greasy", "greed", "greedy", "grief", "grievance", "grievances", "grieve", "grieving", "grievous", "grievously", "grim", "grimace", "grind", "gripe", "gripes", "grisly", "gritty", "gross", "grossly", "grotesque", "grouch", "grouchy", "groundless", "grouse", "growl", "grudge", "grudges", "grudging", "grudgingly", "gruesome", "gruesomely", "gruff", "grumble", "grumpier", "grumpiest", "grumpily", "grumpish", "grumpy", "guile", "guilt", "guiltily", "guilty", "gullible", "gutless", "gutter", "hack", "hacks", "haggard", "haggle", "hairloss", "halfhearted", "halfheartedly", "hallucinate", "hallucination", "hamper", "hampered", "handicapped", "hang", "hangs", "haphazard", "hapless", "harangue", "harass", "harassed", "harasses", "harassment", "harboring", "harbors", "hard", "hard-hit", "hard-line", "hard-liner", "hardball", "harden", "hardened", "hardheaded", "hardhearted", "hardliner", "hardliners", "hardship", "hardships", "harm", "harmed", "harmful", "harms", "harpy", "harridan", "harried", "harrow", "harsh", "harshly", "hasseling", "hassle", "hassled", "hassles", "haste", "hastily", "hasty", "hate", "hated", "hateful", "hatefully", "hatefulness", "hater", "haters", "hates", "hating", "hatred", "haughtily", "haughty", "haunt", "haunting", "havoc", "hawkish", "haywire", "hazard", "hazardous", "haze", "hazy", "head-aches", "headache", "headaches", "heartbreaker", "heartbreaking", "heartbreakingly", "heartless", "heathen", "heavy-handed", "heavyhearted", "heck", "heckle", "heckled", "heckles", "hectic", "hedge", "hedonistic", "heedless", "hefty", "hegemonism", "hegemonistic", "hegemony", "heinous", "hell", "hell-bent", "hellion", "hells", "helpless", "helplessly", "helplessness", "heresy", "heretic", "heretical", "hesitant", "hestitant", "hideous", "hideously", "hideousness", "high-priced", "hiliarious", "hinder", "hindrance", "hiss", "hissed", "hissing", "ho-hum", "hoard", "hoax", "hobble", "hogs", "hollow", "hoodium", "hoodwink", "hooligan", "hopeless", "hopelessly", "hopelessness", "horde", "horrendous", "horrendously", "horrible", "horrid", "horrific", "horrified", "horrifies", "horrify", "horrifying", "horrifys", "hostage", "hostile", "hostilities", "hostility", "hotbeds", "hothead", "hotheaded", "hothouse", "hubris", "huckster", "hum", "humid", "humiliate", "humiliating", "humiliation", "humming", "hung", "hurt", "hurted", "hurtful", "hurting", "hurts", "hustler", "hype", "hypocricy", "hypocrisy", "hypocrite", "hypocrites", "hypocritical", "hypocritically", "hysteria", "hysteric", "hysterical", "hysterically", "hysterics", "idiocies", "idiocy", "idiot", "idiotic", "idiotically", "idiots", "idle", "ignoble", "ignominious", "ignominiously", "ignominy", "ignorance", "ignorant", "ignore", "ill-advised", "ill-conceived", "ill-defined", "ill-designed", "ill-fated", "ill-favored", "ill-formed", "ill-mannered", "ill-natured", "ill-sorted", "ill-tempered", "ill-treated", "ill-treatment", "ill-usage", "ill-used", "illegal", "illegally", "illegitimate", "illicit", "illiterate", "illness", "illogic", "illogical", "illogically", "illusion", "illusions", "illusory", "imaginary", "imbalance", "imbecile", "imbroglio", "immaterial", "immature", "imminence", "imminently", "immobilized", "immoderate", "immoderately", "immodest", "immoral", "immorality", "immorally", "immovable", "impair", "impaired", "impasse", "impatience", "impatient", "impatiently", "impeach", "impedance", "impede", "impediment", "impending", "impenitent", "imperfect", "imperfection", "imperfections", "imperfectly", "imperialist", "imperil", "imperious", "imperiously", "impermissible", "impersonal", "impertinent", "impetuous", "impetuously", "impiety", "impinge", "impious", "implacable", "implausible", "implausibly", "implicate", "implication", "implode", "impolite", "impolitely", "impolitic", "importunate", "importune", "impose", "imposers", "imposing", "imposition", "impossible", "impossiblity", "impossibly", "impotent", "impoverish", "impoverished", "impractical", "imprecate", "imprecise", "imprecisely", "imprecision", "imprison", "imprisonment", "improbability", "improbable", "improbably", "improper", "improperly", "impropriety", "imprudence", "imprudent", "impudence", "impudent", "impudently", "impugn", "impulsive", "impulsively", "impunity", "impure", "impurity", "inability", "inaccuracies", "inaccuracy", "inaccurate", "inaccurately", "inaction", "inactive", "inadequacy", "inadequate", "inadequately", "inadverent", "inadverently", "inadvisable", "inadvisably", "inane", "inanely", "inappropriate", "inappropriately", "inapt", "inaptitude", "inarticulate", "inattentive", "inaudible", "incapable", "incapably", "incautious", "incendiary", "incense", "incessant", "incessantly", "incite", "incitement", "incivility", "inclement", "incognizant", "incoherence", "incoherent", "incoherently", "incommensurate", "incomparable", "incomparably", "incompatability", "incompatibility", "incompatible", "incompetence", "incompetent", "incompetently", "incomplete", "incompliant", "incomprehensible", "incomprehension", "inconceivable", "inconceivably", "incongruous", "incongruously", "inconsequent", "inconsequential", "inconsequentially", "inconsequently", "inconsiderate", "inconsiderately", "inconsistence", "inconsistencies", "inconsistency", "inconsistent", "inconsolable", "inconsolably", "inconstant", "inconvenience", "inconveniently", "incorrect", "incorrectly", "incorrigible", "incorrigibly", "incredulous", "incredulously", "inculcate", "indecency", "indecent", "indecently", "indecision", "indecisive", "indecisively", "indecorum", "indefensible", "indelicate", "indeterminable", "indeterminably", "indeterminate", "indifference", "indifferent", "indigent", "indignant", "indignantly", "indignation", "indignity", "indiscernible", "indiscreet", "indiscreetly", "indiscretion", "indiscriminate", "indiscriminately", "indiscriminating", "indistinguishable", "indoctrinate", "indoctrination", "indolent", "indulge", "ineffective", "ineffectively", "ineffectiveness", "ineffectual", "ineffectually", "ineffectualness", "inefficacious", "inefficacy", "inefficiency", "inefficient", "inefficiently", "inelegance", "inelegant", "ineligible", "ineloquent", "ineloquently", "inept", "ineptitude", "ineptly", "inequalities", "inequality", "inequitable", "inequitably", "inequities", "inescapable", "inescapably", "inessential", "inevitable", "inevitably", "inexcusable", "inexcusably", "inexorable", "inexorably", "inexperience", "inexperienced", "inexpert", "inexpertly", "inexpiable", "inexplainable", "inextricable", "inextricably", "infamous", "infamously", "infamy", "infected", "infection", "infections", "inferior", "inferiority", "infernal", "infest", "infested", "infidel", "infidels", "infiltrator", "infiltrators", "infirm", "inflame", "inflammation", "inflammatory", "inflammed", "inflated", "inflationary", "inflexible", "inflict", "infraction", "infringe", "infringement", "infringements", "infuriate", "infuriated", "infuriating", "infuriatingly", "inglorious", "ingrate", "ingratitude", "inhibit", "inhibition", "inhospitable", "inhospitality", "inhuman", "inhumane", "inhumanity", "inimical", "inimically", "iniquitous", "iniquity", "injudicious", "injure", "injurious", "injury", "injustice", "injustices", "innuendo", "inoperable", "inopportune", "inordinate", "inordinately", "insane", "insanely", "insanity", "insatiable", "insecure", "insecurity", "insensible", "insensitive", "insensitively", "insensitivity", "insidious", "insidiously", "insignificance", "insignificant", "insignificantly", "insincere", "insincerely", "insincerity", "insinuate", "insinuating", "insinuation", "insociable", "insolence", "insolent", "insolently", "insolvent", "insouciance", "instability", "instable", "instigate", "instigator", "instigators", "insubordinate", "insubstantial", "insubstantially", "insufferable", "insufferably", "insufficiency", "insufficient", "insufficiently", "insular", "insult", "insulted", "insulting", "insultingly", "insults", "insupportable", "insupportably", "insurmountable", "insurmountably", "insurrection", "intefere", "inteferes", "intense", "interfere", "interference", "interferes", "intermittent", "interrupt", "interruption", "interruptions", "intimidate", "intimidating", "intimidatingly", "intimidation", "intolerable", "intolerablely", "intolerance", "intoxicate", "intractable", "intransigence", "intransigent", "intrude", "intrusion", "intrusive", "inundate", "inundated", "invader", "invalid", "invalidate", "invalidity", "invasive", "invective", "inveigle", "invidious", "invidiously", "invidiousness", "invisible", "involuntarily", "involuntary", "irascible", "irate", "irately", "ire", "irk", "irked", "irking", "irks", "irksome", "irksomely", "irksomeness", "irksomenesses", "ironic", "ironical", "ironically", "ironies", "irony", "irragularity", "irrational", "irrationalities", "irrationality", "irrationally", "irrationals", "irreconcilable", "irrecoverable", "irrecoverableness", "irrecoverablenesses", "irrecoverably", "irredeemable", "irredeemably", "irreformable", "irregular", "irregularity", "irrelevance", "irrelevant", "irreparable", "irreplacible", "irrepressible", "irresolute", "irresolvable", "irresponsible", "irresponsibly", "irretating", "irretrievable", "irreversible", "irritable", "irritably", "irritant", "irritate", "irritated", "irritating", "irritation", "irritations", "isolate", "isolated", "isolation", "issue", "issues", "itch", "itching", "itchy", "jabber", "jaded", "jagged", "jam", "jarring", "jaundiced", "jealous", "jealously", "jealousness", "jealousy", "jeer", "jeering", "jeeringly", "jeers", "jeopardize", "jeopardy", "jerk", "jerky", "jitter", "jitters", "jittery", "job-killing", "jobless", "joke", "joker", "jolt", "judder", "juddering", "judders", "jumpy", "junk", "junky", "junkyard", "jutter", "jutters", "kaput", "kill", "killed", "killer", "killing", "killjoy", "kills", "knave", "knife", "knock", "knotted", "kook", "kooky", "lack", "lackadaisical", "lacked", "lackey", "lackeys", "lacking", "lackluster", "lacks", "laconic", "lag", "lagged", "lagging", "laggy", "lags", "laid-off", "lambast", "lambaste", "lame", "lame-duck", "lament", "lamentable", "lamentably", "languid", "languish", "languor", "languorous", "languorously", "lanky", "lapse", "lapsed", "lapses", "lascivious", "last-ditch", "latency", "laughable", "laughably", "laughingstock", "lawbreaker", "lawbreaking", "lawless", "lawlessness", "layoff", "layoff-happy", "lazy", "leak", "leakage", "leakages", "leaking", "leaks", "leaky", "lech", "lecher", "lecherous", "lechery", "leech", "leer", "leery", "left-leaning", "lemon", "lengthy", "less-developed", "lesser-known", "letch", "lethal", "lethargic", "lethargy", "lewd", "lewdly", "lewdness", "liability", "liable", "liar", "liars", "licentious", "licentiously", "licentiousness", "lie", "lied", "lier", "lies", "life-threatening", "lifeless", "limit", "limitation", "limitations", "limited", "limits", "limp", "listless", "litigious", "little-known", "livid", "lividly", "loath", "loathe", "loathing", "loathly", "loathsome", "loathsomely", "lone", "loneliness", "lonely", "loner", "lonesome", "long-time", "long-winded", "longing", "longingly", "loophole", "loopholes", "loose", "loot", "lorn", "lose", "loser", "losers", "loses", "losing", "loss", "losses", "lost", "loud", "louder", "lousy", "loveless", "lovelorn", "low-rated", "lowly", "ludicrous", "ludicrously", "lugubrious", "lukewarm", "lull", "lumpy", "lunatic", "lunaticism", "lurch", "lure", "lurid", "lurk", "lurking", "lying", "macabre", "mad", "madden", "maddening", "maddeningly", "madder", "madly", "madman", "madness", "maladjusted", "maladjustment", "malady", "malaise", "malcontent", "malcontented", "maledict", "malevolence", "malevolent", "malevolently", "malice", "malicious", "maliciously", "maliciousness", "malign", "malignant", "malodorous", "maltreatment", "mangle", "mangled", "mangles", "mangling", "mania", "maniac", "maniacal", "manic", "manipulate", "manipulation", "manipulative", "manipulators", "mar", "marginal", "marginally", "martyrdom", "martyrdom-seeking", "mashed", "massacre", "massacres", "matte", "mawkish", "mawkishly", "mawkishness", "meager", "meaningless", "meanness", "measly", "meddle", "meddlesome", "mediocre", "mediocrity", "melancholy", "melodramatic", "melodramatically", "meltdown", "menace", "menacing", "menacingly", "mendacious", "mendacity", "menial", "merciless", "mercilessly", "mess", "messed", "messes", "messing", "messy", "midget", "miff", "militancy", "mindless", "mindlessly", "mirage", "mire", "misalign", "misaligned", "misaligns", "misapprehend", "misbecome", "misbecoming", "misbegotten", "misbehave", "misbehavior", "miscalculate", "miscalculation", "miscellaneous", "mischief", "mischievous", "mischievously", "misconception", "misconceptions", "miscreant", "miscreants", "misdirection", "miser", "miserable", "miserableness", "miserably", "miseries", "miserly", "misery", "misfit", "misfortune", "misgiving", "misgivings", "misguidance", "misguide", "misguided", "mishandle", "mishap", "misinform", "misinformed", "misinterpret", "misjudge", "misjudgment", "mislead", "misleading", "misleadingly", "mislike", "mismanage", "mispronounce", "mispronounced", "mispronounces", "misread", "misreading", "misrepresent", "misrepresentation", "miss", "missed", "misses", "misstatement", "mist", "mistake", "mistaken", "mistakenly", "mistakes", "mistified", "mistress", "mistrust", "mistrustful", "mistrustfully", "mists", "misunderstand", "misunderstanding", "misunderstandings", "misunderstood", "misuse", "moan", "mobster", "mock", "mocked", "mockeries", "mockery", "mocking", "mockingly", "mocks", "molest", "molestation", "monotonous", "monotony", "monster", "monstrosities", "monstrosity", "monstrous", "monstrously", "moody", "moot", "mope", "morbid", "morbidly", "mordant", "mordantly", "moribund", "moron", "moronic", "morons", "mortification", "mortified", "mortify", "mortifying", "motionless", "motley", "mourn", "mourner", "mournful", "mournfully", "muddle", "muddy", "mudslinger", "mudslinging", "mulish", "multi-polarization", "mundane", "murder", "murderer", "murderous", "murderously", "murky", "muscle-flexing", "mushy", "musty", "mysterious", "mysteriously", "mystery", "mystify", "myth", "nag", "nagging", "naive", "naively", "narrower", "nastily", "nastiness", "nasty", "naughty", "nauseate", "nauseates", "nauseating", "nauseatingly", "naÔve", "nebulous", "nebulously", "needless", "needlessly", "needy", "nefarious", "nefariously", "negate", "negation", "negative", "negatives", "negativity", "neglect", "neglected", "negligence", "negligent", "nemesis", "nepotism", "nervous", "nervously", "nervousness", "nettle", "nettlesome", "neurotic", "neurotically", "niggle", "niggles", "nightmare", "nightmarish", "nightmarishly", "nitpick", "nitpicking", "noise", "noises", "noisier", "noisy", "non-confidence", "nonexistent", "nonresponsive", "nonsense", "nosey", "notoriety", "notorious", "notoriously", "noxious", "nuisance", "numb", "obese", "object", "objection", "objectionable", "objections", "oblique", "obliterate", "obliterated", "oblivious", "obnoxious", "obnoxiously", "obscene", "obscenely", "obscenity", "obscure", "obscured", "obscures", "obscurity", "obsess", "obsessive", "obsessively", "obsessiveness", "obsolete", "obstacle", "obstinate", "obstinately", "obstruct", "obstructed", "obstructing", "obstruction", "obstructs", "obtrusive", "obtuse", "occlude", "occluded", "occludes", "occluding", "odd", "odder", "oddest", "oddities", "oddity", "oddly", "odor", "offence", "offend", "offender", "offending", "offenses", "offensive", "offensively", "offensiveness", "officious", "ominous", "ominously", "omission", "omit", "one-sided", "onerous", "onerously", "onslaught", "opinionated", "opponent", "opportunistic", "oppose", "opposition", "oppositions", "oppress", "oppression", "oppressive", "oppressively", "oppressiveness", "oppressors", "ordeal", "orphan", "ostracize", "outbreak", "outburst", "outbursts", "outcast", "outcry", "outlaw", "outmoded", "outrage", "outraged", "outrageous", "outrageously", "outrageousness", "outrages", "outsider", "over-acted", "over-awe", "over-balanced", "over-hyped", "over-priced", "over-valuation", "overact", "overacted", "overawe", "overbalance", "overbalanced", "overbearing", "overbearingly", "overblown", "overdo", "overdone", "overdue", "overemphasize", "overheat", "overkill", "overloaded", "overlook", "overpaid", "overpayed", "overplay", "overpower", "overpriced", "overrated", "overreach", "overrun", "overshadow", "oversight", "oversights", "oversimplification", "oversimplified", "oversimplify", "oversize", "overstate", "overstated", "overstatement", "overstatements", "overstates", "overtaxed", "overthrow", "overthrows", "overturn", "overweight", "overwhelm", "overwhelmed", "overwhelming", "overwhelmingly", "overwhelms", "overzealous", "overzealously", "overzelous", "pain", "painful", "painfull", "painfully", "pains", "pale", "pales", "paltry", "pan", "pandemonium", "pander", "pandering", "panders", "panic", "panick", "panicked", "panicking", "panicky", "paradoxical", "paradoxically", "paralize", "paralyzed", "paranoia", "paranoid", "parasite", "pariah", "parody", "partiality", "partisan", "partisans", "passe", "passive", "passiveness", "pathetic", "pathetically", "patronize", "paucity", "pauper", "paupers", "payback", "peculiar", "peculiarly", "pedantic", "peeled", "peeve", "peeved", "peevish", "peevishly", "penalize", "penalty", "perfidious", "perfidity", "perfunctory", "peril", "perilous", "perilously", "perish", "pernicious", "perplex", "perplexed", "perplexing", "perplexity", "persecute", "persecution", "pertinacious", "pertinaciously", "pertinacity", "perturb", "perturbed", "pervasive", "perverse", "perversely", "perversion", "perversity", "pervert", "perverted", "perverts", "pessimism", "pessimistic", "pessimistically", "pest", "pestilent", "petrified", "petrify", "pettifog", "petty", "phobia", "phobic", "phony", "picket", "picketed", "picketing", "pickets", "picky", "pig", "pigs", "pillage", "pillory", "pimple", "pinch", "pique", "pitiable", "pitiful", "pitifully", "pitiless", "pitilessly", "pittance", "pity", "plagiarize", "plague", "plasticky", "plaything", "plea", "pleas", "plebeian", "plight", "plot", "plotters", "ploy", "plunder", "plunderer", "pointless", "pointlessly", "poison", "poisonous", "poisonously", "pokey", "poky", "polarisation", "polemize", "pollute", "polluter", "polluters", "polution", "pompous", "poor", "poorer", "poorest", "poorly", "posturing", "pout", "poverty", "powerless", "prate", "pratfall", "prattle", "precarious", "precariously", "precipitate", "precipitous", "predatory", "predicament", "prejudge", "prejudice", "prejudices", "prejudicial", "premeditated", "preoccupy", "preposterous", "preposterously", "presumptuous", "presumptuously", "pretence", "pretend", "pretense", "pretentious", "pretentiously", "prevaricate", "pricey", "pricier", "prick", "prickle", "prickles", "prideful", "prik", "primitive", "prison", "prisoner", "problem", "problematic", "problems", "procrastinate", "procrastinates", "procrastination", "profane", "profanity", "prohibit", "prohibitive", "prohibitively", "propaganda", "propagandize", "proprietary", "prosecute", "protest", "protested", "protesting", "protests", "protracted", "provocation", "provocative", "provoke", "pry", "pugnacious", "pugnaciously", "pugnacity", "punch", "punish", "punishable", "punitive", "punk", "puny", "puppet", "puppets", "puzzled", "puzzlement", "puzzling", "quack", "qualm", "qualms", "quandary", "quarrel", "quarrellous", "quarrellously", "quarrels", "quarrelsome", "quash", "queer", "questionable", "quibble", "quibbles", "quitter", "rabid", "racism", "racist", "racists", "racy", "radical", "radicalization", "radically", "radicals", "rage", "ragged", "raging", "rail", "raked", "rampage", "rampant", "ramshackle", "rancor", "randomly", "rankle", "rant", "ranted", "ranting", "rantingly", "rants", "rape", "raped", "raping", "rascal", "rascals", "rash", "rattle", "rattled", "rattles", "ravage", "raving", "reactionary", "rebellious", "rebuff", "rebuke", "recalcitrant", "recant", "recession", "recessionary", "reckless", "recklessly", "recklessness", "recoil", "recourses", "redundancy", "redundant", "refusal", "refuse", "refused", "refuses", "refusing", "refutation", "refute", "refuted", "refutes", "refuting", "regress", "regression", "regressive", "regret", "regreted", "regretful", "regretfully", "regrets", "regrettable", "regrettably", "regretted", "reject", "rejected", "rejecting", "rejection", "rejects", "relapse", "relentless", "relentlessly", "relentlessness", "reluctance", "reluctant", "reluctantly", "remorse", "remorseful", "remorsefully", "remorseless", "remorselessly", "remorselessness", "renounce", "renunciation", "repel", "repetitive", "reprehensible", "reprehensibly", "reprehension", "reprehensive", "repress", "repression", "repressive", "reprimand", "reproach", "reproachful", "reprove", "reprovingly", "repudiate", "repudiation", "repugn", "repugnance", "repugnant", "repugnantly", "repulse", "repulsed", "repulsing", "repulsive", "repulsively", "repulsiveness", "resent", "resentful", "resentment", "resignation", "resigned", "resistance", "restless", "restlessness", "restrict", "restricted", "restriction", "restrictive", "resurgent", "retaliate", "retaliatory", "retard", "retarded", "retardedness", "retards", "reticent", "retract", "retreat", "retreated", "revenge", "revengeful", "revengefully", "revert", "revile", "reviled", "revoke", "revolt", "revolting", "revoltingly", "revulsion", "revulsive", "rhapsodize", "rhetoric", "rhetorical", "ricer", "ridicule", "ridicules", "ridiculous", "ridiculously", "rife", "rift", "rifts", "rigid", "rigidity", "rigidness", "rile", "riled", "rip", "rip-off", "ripoff", "ripped", "risk", "risks", "risky", "rival", "rivalry", "roadblocks", "rocky", "rogue", "rollercoaster", "rot", "rotten", "rough", "rremediable", "rubbish", "rude", "rue", "ruffian", "ruffle", "ruin", "ruined", "ruining", "ruinous", "ruins", "rumbling", "rumor", "rumors", "rumours", "rumple", "run-down", "runaway", "rupture", "rust", "rusts", "rusty", "rut", "ruthless", "ruthlessly", "ruthlessness", "ruts", "sabotage", "sack", "sacrificed", "sad", "sadden", "sadly", "sadness", "sag", "sagged", "sagging", "saggy", "sags", "salacious", "sanctimonious", "sap", "sarcasm", "sarcastic", "sarcastically", "sardonic", "sardonically", "sass", "satirical", "satirize", "savage", "savaged", "savagery", "savages", "scaly", "scam", "scams", "scandal", "scandalize", "scandalized", "scandalous", "scandalously", "scandals", "scandel", "scandels", "scant", "scapegoat", "scar", "scarce", "scarcely", "scarcity", "scare", "scared", "scarier", "scariest", "scarily", "scarred", "scars", "scary", "scathing", "scathingly", "sceptical", "scoff", "scoffingly", "scold", "scolded", "scolding", "scoldingly", "scorching", "scorchingly", "scorn", "scornful", "scornfully", "scoundrel", "scourge", "scowl", "scramble", "scrambled", "scrambles", "scrambling", "scrap", "scratch", "scratched", "scratches", "scratchy", "scream", "screech", "screw-up", "screwed", "screwed-up", "screwy", "scuff", "scuffs", "scum", "scummy", "second-class", "second-tier", "secretive", "sedentary", "seedy", "seethe", "seething", "self-coup", "self-criticism", "self-defeating", "self-destructive", "self-humiliation", "self-interest", "self-interested", "self-serving", "selfinterested", "selfish", "selfishly", "selfishness", "semi-retarded", "senile", "sensationalize", "senseless", "senselessly", "seriousness", "sermonize", "servitude", "set-up", "setback", "setbacks", "sever", "severe", "severity", "sh*t", "shabby", "shadowy", "shady", "shake", "shaky", "shallow", "sham", "shambles", "shame", "shameful", "shamefully", "shamefulness", "shameless", "shamelessly", "shamelessness", "shark", "sharply", "shatter", "shemale", "shimmer", "shimmy", "shipwreck", "shirk", "shirker", "shit", "shiver", "shock", "shocked", "shocking", "shockingly", "shoddy", "short-lived", "shortage", "shortchange", "shortcoming", "shortcomings", "shortness", "shortsighted", "shortsightedness", "showdown", "shrew", "shriek", "shrill", "shrilly", "shrivel", "shroud", "shrouded", "shrug", "shun", "shunned", "sick", "sicken", "sickening", "sickeningly", "sickly", "sickness", "sidetrack", "sidetracked", "siege", "sillily", "silly", "simplistic", "simplistically", "sin", "sinful", "sinfully", "sinister", "sinisterly", "sink", "sinking", "skeletons", "skeptic", "skeptical", "skeptically", "skepticism", "sketchy", "skimpy", "skinny", "skittish", "skittishly", "skulk", "slack", "slander", "slanderer", "slanderous", "slanderously", "slanders", "slap", "slashing", "slaughter", "slaughtered", "slave", "slaves", "sleazy", "slime", "slog", "slogged", "slogging", "slogs", "sloooooooooooooow", "sloooow", "slooow", "sloow", "sloppily", "sloppy", "sloth", "slothful", "slow", "slow-moving", "slowed", "slower", "slowest", "slowly", "sloww", "slowww", "slowwww", "slug", "sluggish", "slump", "slumping", "slumpping", "slur", "slut", "sluts", "sly", "smack", "smallish", "smash", "smear", "smell", "smelled", "smelling", "smells", "smelly", "smelt", "smoke", "smokescreen", "smolder", "smoldering", "smother", "smoulder", "smouldering", "smudge", "smudged", "smudges", "smudging", "smug", "smugly", "smut", "smuttier", "smuttiest", "smutty", "snag", "snagged", "snagging", "snags", "snappish", "snappishly", "snare", "snarky", "snarl", "sneak", "sneakily", "sneaky", "sneer", "sneering", "sneeringly", "snob", "snobbish", "snobby", "snobish", "snobs", "snub", "so-cal", "soapy", "sob", "sober", "sobering", "solemn", "solicitude", "somber", "sore", "sorely", "soreness", "sorrow", "sorrowful", "sorrowfully", "sorry", "sour", "sourly", "spade", "spank", "spendy", "spew", "spewed", "spewing", "spews", "spilling", "spinster", "spiritless", "spite", "spiteful", "spitefully", "spitefulness", "splatter", "split", "splitting", "spoil", "spoilage", "spoilages", "spoiled", "spoilled", "spoils", "spook", "spookier", "spookiest", "spookily", "spooky", "spoon-fed", "spoon-feed", "spoonfed", "sporadic", "spotty", "spurious", "spurn", "sputter", "squabble", "squabbling", "squander", "squash", "squeak", "squeaks", "squeaky", "squeal", "squealing", "squeals", "squirm", "stab", "stagnant", "stagnate", "stagnation", "staid", "stain", "stains", "stale", "stalemate", "stall", "stalls", "stammer", "stampede", "standstill", "stark", "starkly", "startle", "startling", "startlingly", "starvation", "starve", "static", "steal", "stealing", "steals", "steep", "steeply", "stench", "stereotype", "stereotypical", "stereotypically", "stern", "stew", "sticky", "stiff", "stiffness", "stifle", "stifling", "stiflingly", "stigma", "stigmatize", "sting", "stinging", "stingingly", "stingy", "stink", "stinks", "stodgy", "stole", "stolen", "stooge", "stooges", "stormy", "straggle", "straggler", "strain", "strained", "straining", "strange", "strangely", "stranger", "strangest", "strangle", "streaky", "strenuous", "stress", "stresses", "stressful", "stressfully", "stricken", "strict", "strictly", "strident", "stridently", "strife", "strike", "stringent", "stringently", "struck", "struggle", "struggled", "struggles", "struggling", "strut", "stubborn", "stubbornly", "stubbornness", "stuck", "stuffy", "stumble", "stumbled", "stumbles", "stump", "stumped", "stumps", "stun", "stunt", "stunted", "stupid", "stupidest", "stupidity", "stupidly", "stupified", "stupify", "stupor", "stutter", "stuttered", "stuttering", "stutters", "sty", "stymied", "sub-par", "subdued", "subjected", "subjection", "subjugate", "subjugation", "submissive", "subordinate", "subpoena", "subpoenas", "subservience", "subservient", "substandard", "subtract", "subversion", "subversive", "subversively", "subvert", "succumb", "suck", "sucked", "sucker", "sucks", "sucky", "sue", "sued", "sueing", "sues", "suffer", "suffered", "sufferer", "sufferers", "suffering", "suffers", "suffocate", "sugar-coat", "sugar-coated", "sugarcoated", "suicidal", "suicide", "sulk", "sullen", "sully", "sunder", "sunk", "sunken", "superficial", "superficiality", "superficially", "superfluous", "superstition", "superstitious", "suppress", "suppression", "surrender", "susceptible", "suspect", "suspicion", "suspicions", "suspicious", "suspiciously", "swagger", "swamped", "sweaty", "swelled", "swelling", "swindle", "swipe", "swollen", "symptom", "symptoms", "syndrome", "taboo", "tacky", "taint", "tainted", "tamper", "tangle", "tangled", "tangles", "tank", "tanked", "tanks", "tantrum", "tardy", "tarnish", "tarnished", "tarnishes", "tarnishing", "tattered", "taunt", "taunting", "tauntingly", "taunts", "taut", "tawdry", "taxing", "tease", "teasingly", "tedious", "tediously", "temerity", "temper", "tempest", "temptation", "tenderness", "tense", "tension", "tentative", "tentatively", "tenuous", "tenuously", "tepid", "terrible", "terribleness", "terribly", "terror", "terror-genic", "terrorism", "terrorize", "testily", "testy", "tetchily", "tetchy", "thankless", "thicker", "thirst", "thorny", "thoughtless", "thoughtlessly", "thoughtlessness", "thrash", "threat", "threaten", "threatening", "threats", "threesome", "throb", "throbbed", "throbbing", "throbs", "throttle", "thug", "thumb-down", "thumbs-down", "thwart", "time-consuming", "timid", "timidity", "timidly", "timidness", "tin-y", "tingled", "tingling", "tired", "tiresome", "tiring", "tiringly", "toil", "toll", "top-heavy", "topple", "torment", "tormented", "torrent", "tortuous", "torture", "tortured", "tortures", "torturing", "torturous", "torturously", "totalitarian", "touchy", "toughness", "tout", "touted", "touts", "toxic", "traduce", "tragedy", "tragic", "tragically", "traitor", "traitorous", "traitorously", "tramp", "trample", "transgress", "transgression", "trap", "traped", "trapped", "trash", "trashed", "trashy", "trauma", "traumatic", "traumatically", "traumatize", "traumatized", "travesties", "travesty", "treacherous", "treacherously", "treachery", "treason", "treasonous", "trick", "tricked", "trickery", "tricky", "trivial", "trivialize", "trouble", "troubled", "troublemaker", "troubles", "troublesome", "troublesomely", "troubling", "troublingly", "truant", "tumble", "tumbled", "tumbles", "tumultuous", "turbulent", "turmoil", "twist", "twisted", "twists", "two-faced", "two-faces", "tyrannical", "tyrannically", "tyranny", "tyrant", "ugh", "uglier", "ugliest", "ugliness", "ugly", "ulterior", "ultimatum", "ultimatums", "ultra-hardline", "un-viewable", "unable", "unacceptable", "unacceptablely", "unacceptably", "unaccessible", "unaccustomed", "unachievable", "unaffordable", "unappealing", "unattractive", "unauthentic", "unavailable", "unavoidably", "unbearable", "unbearablely", "unbelievable", "unbelievably", "uncaring", "uncertain", "uncivil", "uncivilized", "unclean", "unclear", "uncollectible", "uncomfortable", "uncomfortably", "uncomfy", "uncompetitive", "uncompromising", "uncompromisingly", "unconfirmed", "unconstitutional", "uncontrolled", "unconvincing", "unconvincingly", "uncooperative", "uncouth", "uncreative", "undecided", "undefined", "undependability", "undependable", "undercut", "undercuts", "undercutting", "underdog", "underestimate", "underlings", "undermine", "undermined", "undermines", "undermining", "underpaid", "underpowered", "undersized", "undesirable", "undetermined", "undid", "undignified", "undissolved", "undocumented", "undone", "undue", "unease", "uneasily", "uneasiness", "uneasy", "uneconomical", "unemployed", "unequal", "unethical", "uneven", "uneventful", "unexpected", "unexpectedly", "unexplained", "unfairly", "unfaithful", "unfaithfully", "unfamiliar", "unfavorable", "unfeeling", "unfinished", "unfit", "unforeseen", "unforgiving", "unfortunate", "unfortunately", "unfounded", "unfriendly", "unfulfilled", "unfunded", "ungovernable", "ungrateful", "unhappily", "unhappiness", "unhappy", "unhealthy", "unhelpful", "unilateralism", "unimaginable", "unimaginably", "unimportant", "uninformed", "uninsured", "unintelligible", "unintelligile", "unipolar", "unjust", "unjustifiable", "unjustifiably", "unjustified", "unjustly", "unkind", "unkindly", "unknown", "unlamentable", "unlamentably", "unlawful", "unlawfully", "unlawfulness", "unleash", "unlicensed", "unlikely", "unlucky", "unmoved", "unnatural", "unnaturally", "unnecessary", "unneeded", "unnerve", "unnerved", "unnerving", "unnervingly", "unnoticed", "unobserved", "unorthodox", "unorthodoxy", "unpleasant", "unpleasantries", "unpopular", "unpredictable", "unprepared", "unproductive", "unprofitable", "unprove", "unproved", "unproven", "unproves", "unproving", "unqualified", "unravel", "unraveled", "unreachable", "unreadable", "unrealistic", "unreasonable", "unreasonably", "unrelenting", "unrelentingly", "unreliability", "unreliable", "unresolved", "unresponsive", "unrest", "unruly", "unsafe", "unsatisfactory", "unsavory", "unscrupulous", "unscrupulously", "unsecure", "unseemly", "unsettle", "unsettled", "unsettling", "unsettlingly", "unskilled", "unsophisticated", "unsound", "unspeakable", "unspeakablely", "unspecified", "unstable", "unsteadily", "unsteadiness", "unsteady", "unsuccessful", "unsuccessfully", "unsupported", "unsupportive", "unsure", "unsuspecting", "unsustainable", "untenable", "untested", "unthinkable", "unthinkably", "untimely", "untouched", "untrue", "untrustworthy", "untruthful", "unusable", "unusably", "unuseable", "unuseably", "unusual", "unusually", "unviewable", "unwanted", "unwarranted", "unwatchable", "unwelcome", "unwell", "unwieldy", "unwilling", "unwillingly", "unwillingness", "unwise", "unwisely", "unworkable", "unworthy", "unyielding", "upbraid", "upheaval", "uprising", "uproar", "uproarious", "uproariously", "uproarous", "uproarously", "uproot", "upset", "upseting", "upsets", "upsetting", "upsettingly", "urgent", "useless", "usurp", "usurper", "utterly", "vagrant", "vague", "vagueness", "vain", "vainly", "vanity", "vehement", "vehemently", "vengeance", "vengeful", "vengefully", "vengefulness", "venom", "venomous", "venomously", "vent", "vestiges", "vex", "vexation", "vexing", "vexingly", "vibrate", "vibrated", "vibrates", "vibrating", "vibration", "vice", "vicious", "viciously", "viciousness", "victimize", "vile", "vileness", "vilify", "villainous", "villainously", "villains", "villian", "villianous", "villianously", "villify", "vindictive", "vindictively", "vindictiveness", "violate", "violation", "violator", "violators", "violent", "violently", "viper", "virulence", "virulent", "virulently", "virus", "vociferous", "vociferously", "volatile", "volatility", "vomit", "vomited", "vomiting", "vomits", "vulgar", "vulnerable", "wack", "wail", "wallow", "wane", "waning", "wanton", "war-like", "warily", "wariness", "warlike", "warned", "warning", "warp", "warped", "wary", "washed-out", "waste", "wasted", "wasteful", "wastefulness", "wasting", "water-down", "watered-down", "wayward", "weak", "weaken", "weakening", "weaker", "weakness", "weaknesses", "weariness", "wearisome", "weary", "wedge", "weed", "weep", "weird", "weirdly", "wheedle", "whimper", "whine", "whining", "whiny", "whips", "whore", "whores", "wicked", "wickedly", "wickedness", "wild", "wildly", "wiles", "wilt", "wily", "wimpy", "wince", "wobble", "wobbled", "wobbles", "woe", "woebegone", "woeful", "woefully", "womanizer", "womanizing", "worn", "worried", "worriedly", "worrier", "worries", "worrisome", "worry", "worrying", "worryingly", "worse", "worsen", "worsening", "worst", "worthless", "worthlessly", "worthlessness", "wound", "wounds", "wrangle", "wrath", "wreak", "wreaked", "wreaks", "wreck", "wrest", "wrestle", "wretch", "wretched", "wretchedly", "wretchedness", "wrinkle", "wrinkled", "wrinkles", "wrip", "wripped", "wripping", "writhe", "wrong", "wrongful", "wrongly", "wrought", "yawn", "zap", "zapped", "zaps", "zealot", "zealous", "zealously", "zombie"]

  constructor(public db: Database, public auth: Auth, public toast: NgToastService, public spinner: NgxSpinnerService, public router: Router, private ngZone: NgZone, public db2: AngularFireDatabase, public dialogRef: MatDialog, public dbstorage: DbstorageService, public hottoast: HotToastService, public sentiment: SentimentAlgoService) {

  }
  registerStudent(first_name: string, middle_name: string, last_name: string, address: string, email: string, password: string, repassword: string, gender: string, idno: string, section: string, skills: any, contactNo: string) {
    this.spinner.show();

    const studentRef = ref(getDatabase(), "Students/");
    get(studentRef).then((snapshot) => {
      if (snapshot.hasChildren()) {
        snapshot.forEach((snapshot2) => {
          var femail = snapshot2.child("email").val();
          if (femail === email) {
            this.spinner.hide();
            this.toast.error({ detail: "ERROR", summary: "Email is already taken!", duration: 3000 });
            return;
          }
          else {
            if (password != repassword) {
              this.spinner.hide();
              this.toast.error({ detail: "ERROR", summary: "Password doesn't matched!", duration: 3000 });
              return;

            }
            createUserWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
              //Sign In
              const user = userCredential.user;
              set(ref(this.db, "Students/" + user.uid), {
                Firstname: first_name,
                Middlename: middle_name,
                Lastname: last_name,
                Address: address,
                email: email,
                photoURL: "",
                gender: gender,
                idno: idno,
                section: section,
                skills: skills,
                contactNo: contactNo,
                resume: "",
                hired: "",
                id: user.uid,
                rating: "",
                negative: 0,
                positive: 0,
                careerObjective: "",
                educationalBackground: "",
                certificate: ""
              }).then(() => {
                this.toast.success({ detail: "SUCCESS", summary: "Account sucessfully created!", duration: 3000 });
                sendEmailVerification(user).then(() => {
                  this.toast.info({ detail: "NOTE", summary: "Please check your email to verify", duration: 3000 });
                  this.spinner.hide();
                  this.ngZone.run(() => this.router.navigate([""]));
                  return;
                })
              });
            }).catch((error) => {
              this.spinner.hide();
              const errorCode = error.code;
              const errorMessage = error.message;
            })
          }
        })
      }
      else {
        createUserWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
          //Sign In
          const user = userCredential.user;
          set(ref(this.db, "Students/" + user.uid), {
            Firstname: first_name,
            Middlename: middle_name,
            Lastname: last_name,
            Address: address,
            email: email,
            photoURL: "",
            gender: gender,
            idno: idno,
            section: section,
            skills: skills,
            contactNo: contactNo,
            resume: "",
            hired: "",
            id: user.uid,
            rating: "",
            negative: 0,
            positive: 0
          }).then(() => {
            this.toast.success({ detail: "SUCCESS", summary: "Account sucessfully created!", duration: 3000 });
            sendEmailVerification(user).then(() => {
              this.toast.info({ detail: "NOTE", summary: "Please check your email to verify", duration: 3000 });
              this.spinner.hide();
              this.ngZone.run(() => this.router.navigate([""]));
              return;
            })
          });
        }).catch((error) => {
          this.spinner.hide();
          const errorCode = error.code;
          const errorMessage = error.message;
        })
      }
    });
  }

  loginStudent(email: string, password: string) {
    const auth = getAuth();
    const studentRef = ref(getDatabase(), "Students/");
    this.spinner.show();
    const ref2 = this.db2.database.ref();
    ref2.child("Students").orderByChild("email").equalTo(email).once("value", snapshot => {
      if (snapshot.exists()) {
        get(studentRef).then((snapshot) => {
          snapshot.forEach((snapshot2) => {
            const data = snapshot2.val();
            if (email == data.email) {
              this.spinner.show();
              signInWithEmailAndPassword(auth, email, password).then((userCredentials) => {
                if (userCredentials.user.emailVerified == true) {
                  this.spinner.hide();
                  this.ngZone.run(() => this.router.navigate(["StudentHome"]));
                  localStorage.setItem("currentUser", userCredentials.user.uid);
                }
                else {
                  this.toast.info({ detail: "NOTE", summary: "Please check your email to verify", duration: 3000 });
                  this.spinner.hide();
                }
              }).catch((error) => {
                this.spinner.hide();
                this.toast.error({ detail: "ERROR", summary: "Email/Username or Password is incorrect", duration: 3000 });
              })
              return;
            }
          });
        });
      }
      else {
        this.spinner.hide();
        this.toast.error({ detail: "ERROR", summary: "Account is not existing", duration: 3000 });
        return;
      }
    })
  }

  loginAdmin(email: string, password: string) {
    const auth = getAuth();
    const studentRef = ref(getDatabase(), "Administrator/");
    this.spinner.show();
    const ref2 = this.db2.database.ref();
    ref2.child("Administrator").orderByChild("email").equalTo(email).once("value", snapshot => {
      if (snapshot.exists()) {
        get(studentRef).then((snapshot) => {
          snapshot.forEach((snapshot2) => {
            const data = snapshot2.val();
            if (email == data.email) {
              this.spinner.show();
              signInWithEmailAndPassword(auth, email, password).then((userCredentials) => {
                this.spinner.hide();
                this.ngZone.run(() => this.router.navigate(["AdminDashboard"]));
                localStorage.setItem("currentUser", userCredentials.user.uid);
              }).catch((error) => {

                this.spinner.hide();
                this.toast.error({ detail: "ERROR", summary: "Email/Username or Password is incorrect", duration: 3000 });
              })
              return;
            }
          });
        });
      }
      else {
        this.spinner.hide();
        this.toast.error({ detail: "ERROR", summary: "Account is not existing", duration: 3000 });
        return;
      }
    })
  }

  Forgotpassword(email: string) {
    const auth = getAuth();
    this.spinner.show();
    sendPasswordResetEmail(auth, email).then(() => {
      this.toast.success({ detail: "SUCCESS", summary: "Check your email to reset password!", duration: 3000, });
      this.router.navigate(['']);
      this.dialogRef.closeAll();
      this.spinner.hide();
    }).catch((error) => {
      this.toast.error({ detail: "ERROR", summary: "Account doesn't exist!", duration: 3000 });
      this.spinner.hide();
    })
  }

  logout() {
    const auth = getAuth();
    this.spinner.show();
    signOut(auth).then(() => {
      this.toast.success({ detail: "SUCCESS", summary: "Sucessfully logged out", duration: 3000 });
      localStorage.clear();
      this.ngZone.run(() => this.router.navigate([""]));
      this.spinner.hide();
    }).catch(() => {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Something went wrong", duration: 3000 });
    })
  }

  getCurrentStudent() {
    this.spinner.show();
    var currentUser = localStorage.getItem("currentUser");
    var studentObj: any = {};
    const studentRef = ref(getDatabase(), "Students/" + currentUser);
    var contactNo: string;
    var newContactNo: string;
    onValue(studentRef, ((snapshot) => {
      const data = snapshot.val();
      studentObj.firstName = data.Firstname;
      studentObj.lastName = data.Lastname;
      studentObj.middleName = data.Middlename;
      studentObj.address = data.Address;
      studentObj.photoURL = data.photoURL;
      studentObj.email = data.email;
      studentObj.gender = data.gender;
      studentObj.idno = data.idno;
      contactNo = data.contactNo;
      newContactNo = contactNo.replace("+63", "");
      studentObj.contactNo = newContactNo;
      studentObj.section = data.section;
      studentObj.skills = data.skills;
      studentObj.resume = data.resume;
      studentObj.hired = data.hired;
      studentObj.positive = data.positive;
      studentObj.negative = data.negative;
      studentObj.careerObjective = data.careerObjective;
      studentObj.educationalBackground = (data.educationalBackground ? data.educationalBackground : [{ school: "", basicEducation: "", startYear: 0, endYear: 0 }]);
      studentObj.certificate = (data.certificate ? data.certificate : [{ title: "", date: 0 }]);
      console.log(studentObj)
      this.spinner.hide();
    }))
    return studentObj;
  }

  getSkillsCurrentStudent() {
    var currentUser = localStorage.getItem("currentUser");
    var studentSkills: any = [];
    const studentRef = ref(getDatabase(), "Students/" + currentUser + "/skills");
    onValue(studentRef, ((snapshot) => {
      snapshot.forEach((snapshot2) => {
        var data = snapshot2.val();
        studentSkills.push(data);
      })
    }))
    return studentSkills;
  }

  resetPassword(email: string) {
    const auth = getAuth();
    this.spinner.show();
    sendPasswordResetEmail(auth, email).then(() => {
      this.toast.success({ detail: "SUCCESS", summary: "Please check your email to reset password!", duration: 3000 });
      this.spinner.hide();
    }).catch((error) => {
      this.toast.error({ detail: "ERROR", summary: "Something went wrong!", duration: 3000 });
      this.spinner.hide();
    })
  }

  editProfileDetails(first_name: string, middle_name: string, last_name: string, address: string, idno: string, section: string, contactNo: string, skills: any, careerObjective: string, educationalBackground: any, certificate: any) {
    const user = this.auth.currentUser;
    this.spinner.show();
    const studentRef = ref(getDatabase(), "Students/" + user?.uid);

    get(studentRef).then((snapshot) => {
      const data = snapshot.val();
      update(ref(this.db, "Students/" + user?.uid), {
        Firstname: first_name,
        Lastname: last_name,
        Middlename: middle_name,
        Address: address,
        photoURL: data.photoURL,
        email: data.email,
        idno: idno,
        contactNo: contactNo,
        skills: skills,
        section: section,
        resume: data.resume,
        careerObjective: careerObjective,
        educationalBackground: educationalBackground,
        certificate: certificate

      }).then(() => {
        this.spinner.hide();
        this.toast.success({ detail: "SUCCESS", summary: "Account information sucessfully edited", duration: 3000 });
        this.router.navigate(['Profile']);
      }).catch(() => {
        this.spinner.hide();
        this.toast.error({ detail: "ERROR", summary: "Something went wrong", duration: 3000 });
      });
    });
  }

  updateProfilePicStudent(profileData: any): Observable<any> {
    const user = localStorage.getItem("currentUser");
    const studentRef = ref(getDatabase(), "Students/" + user);
    get(studentRef).then((snapshot) => {
      const data = snapshot.val();
      update(studentRef, {
        photoURL: profileData
      })
    })
    return of(user).pipe()
  }

  updateResumeStudent(profileData: any): Observable<any> {
    const user = localStorage.getItem("currentUser");
    const studentRef = ref(getDatabase(), "Students/" + user);
    get(studentRef).then((snapshot) => {
      const data = snapshot.val();
      update(studentRef, {
        resume: profileData
      })
    })
    return of(user).pipe()
  }

  developers!: AngularFireList<any>;
  getDevelopers(): Observable<any> {
    this.developers = this.db2.list("Developers/", ref =>
      ref.orderByChild("developerName")
    );
    return this.developers.valueChanges();
  }

  evaluators!: AngularFireList<any>;
  getAllEvaluator(): Observable<any> {
    this.evaluators = this.db2.list("Recruiters", ref =>
      ref.orderByChild("status").equalTo("activated")
    );
    return this.evaluators.valueChanges();
  }

  evaluatorsDeactive!: AngularFireList<any>;
  getAllEvaluatorDeactive(): Observable<any> {
    this.evaluatorsDeactive = this.db2.list("Recruiters", ref =>
      ref.orderByChild("status").equalTo("deactivated")
    );
    return this.evaluatorsDeactive.valueChanges();
  }


  registerRecruiter(companyName: string, recruiterName: string, email: string, dateAdded: any, password: string, repassword: string) {
    this.spinner.show();
    const auth = getAuth();
    const evalRef = ref(getDatabase(), "Recruiters/");
    get(evalRef).then((snapshot) => {
      if (snapshot.hasChildren()) {
        snapshot.forEach((snapshot2) => {
          var femail = snapshot2.child("email").val();
          var fcompanyName = snapshot2.child("companyName").val();
          if (femail === email) {
            this.spinner.hide();
            this.toast.error({ detail: "ERROR", summary: "Email is already taken!", duration: 3000 });
            return;
          }
          else {
            if (password != repassword) {
              this.spinner.hide();
              this.toast.error({ detail: "ERROR", summary: "Password doesn't matched!", duration: 3000 });
              return;
            }
            if (fcompanyName == companyName) {
              this.spinner.hide();
              this.toast.error({ detail: "ERROR", summary: "Company is already existing!", duration: 3000 });
              return;
            }

            createUserWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
              //Sign In
              const user = userCredential.user;
              const auth = getAuth();

              set(ref(this.db, "Recruiters/" + user.uid), {
                companyName: companyName,
                recruiterName: recruiterName,
                email: email,
                dateAdded: dateAdded,
                photoURL: "",
                id: user.uid,
                status: "activated",
                contactNo: "",
                companyLogo: "",
                rating: "",
                negative: 0,
                positive: 0
              }).then(() => {
                this.spinner.hide();
                this.toast.success({ detail: "SUCCESS", summary: "Account sucessfully created!", duration: 3000 });
                this.dialogRef.closeAll();
              });
            }).catch((error) => {
              this.spinner.hide();
              const errorCode = error.code;
              const errorMessage = error.message;
            })
          }
        })
      }
      else {
        createUserWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
          //Sign In
          const user = userCredential.user;
          const auth = getAuth();
          set(ref(this.db, "Recruiters/" + user.uid), {
            companyName: companyName,
            recruiterName: recruiterName,
            email: email,
            dateAdded: dateAdded,
            photoURL: "",
            id: user.uid,
            status: "activated",
            contactNo: "",
            companyLogo: "",
            rating: "",
            negative: 0,
            positive: 0
          }).then(() => {
            this.spinner.hide();
            this.toast.success({ detail: "SUCCESS", summary: "Account sucessfully created!", duration: 3000 });
            this.dialogRef.closeAll();
          });
        }).catch((error) => {
          this.spinner.hide();
          const errorCode = error.code;
          const errorMessage = error.message;
          return;
        })
      }
    });
  }

  editRecruiter(companyName: string, recruiterName: string, id: string) {
    const recruiterRef = ref(getDatabase(), "Recruiters/" + id);
    this.spinner.show();

    update(recruiterRef, {
      companyName: companyName,
      recruiterName: recruiterName
    }).then(() => {
      this.spinner.hide();
      this.toast.success({ detail: "SUCCESS", summary: "Account sucessfully created!", duration: 3000 });
      this.dialogRef.closeAll();
    }).catch(() => {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Something went wrong!", duration: 3000 });
    })
  }
  deactivateRecruiter(id: any) {
    this.spinner.show();
    var recruiterRef = ref(getDatabase(), "Recruiters/" + id);
    update(recruiterRef, {
      status: "deactivated"
    }).then(() => {
      this.spinner.hide();
      this.toast.success({ detail: "SUCCESS", summary: "Recruiter sucessfully deactivated", duration: 3000 });
      this.dialogRef.closeAll();
    }).catch(() => {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Something went wrong", duration: 3000 });
    })
  }

  reactivateRecruiter(id: any) {
    this.spinner.show();
    var recruiterRef = ref(getDatabase(), "Recruiters/" + id);
    update(recruiterRef, {
      status: "activated"
    }).then(() => {
      this.spinner.hide();
      this.toast.success({ detail: "SUCCESS", summary: "Recruiter sucessfully activated", duration: 3000 });
      this.dialogRef.closeAll();
    }).catch(() => {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Something went wrong", duration: 3000 });
    })
  }


  students!: AngularFireList<any>;
  getAllStudent(): Observable<any> {
    this.students = this.db2.list("Students", ref =>
      ref.orderByChild("Lastname")
    );
    return this.students.valueChanges();
  }

  updateWorkOnItImage(profileData: any): Observable<any> {
    const user = localStorage.getItem("currentUser");
    const studentRef = ref(getDatabase(), "System Contents/AboutWorkOnIt");
    get(studentRef).then((snapshot) => {
      const data = snapshot.val();
      update(studentRef, {
        photoURL: profileData
      })
    })
    return of(user).pipe()
  }

  getAboutWorkOnIt() {
    var dataObj: any = {};
    const systemRef = ref(getDatabase(), "System Contents/AboutWorkOnIt");
    this.spinner.show();
    onValue(systemRef, (snapshot) => {
      var data = snapshot.val();
      dataObj.photoURL = data.photoURL;
      dataObj.text = data.text;
      this.spinner.hide();
    })
    return dataObj;
  }

  editAboutWorkOnItText(text: any) {
    const systemRef = ref(getDatabase(), "System Contents/AboutWorkOnIt");
    this.spinner.show();
    update(systemRef, {
      text: text
    }).then(() => {
      this.spinner.hide();
      this.toast.success({ detail: "SUCCESS", summary: "Text successfully edited", duration: 3000 });
      this.router.navigate(['AdminAboutWorkOnIt']);
    })
  }

  updateCICTImage(profileData: any): Observable<any> {
    const user = localStorage.getItem("currentUser");
    const studentRef = ref(getDatabase(), "System Contents/AboutCICT");
    get(studentRef).then((snapshot) => {
      const data = snapshot.val();
      update(studentRef, {
        photoURL: profileData
      })
    })
    return of(user).pipe(
    )
  }

  getAboutCICT() {
    var dataObj: any = {};
    const systemRef = ref(getDatabase(), "System Contents/AboutCICT");
    this.spinner.show();
    onValue(systemRef, (snapshot) => {
      var data = snapshot.val();
      dataObj.photoURL = data.photoURL;
      dataObj.text = data.text;
      this.spinner.hide();
    })
    return dataObj;
  }

  editAboutCICTText(text: any) {
    const systemRef = ref(getDatabase(), "System Contents/AboutCICT");
    this.spinner.show();
    update(systemRef, {
      text: text
    }).then(() => {
      this.spinner.hide();
      this.toast.success({ detail: "SUCCESS", summary: "Text successfully edited", duration: 3000 });
      this.router.navigate(['AdminAboutCICT']);
    })
  }

  addDeveloper(developerName: string, photoURL: any) {
    const deveoperRef = ref(getDatabase(), "Developers/");
    this.spinner.show();
    push(deveoperRef, {
      developerName: developerName
    }).then((res) => {
      const uid = res.key;
      update(ref(getDatabase(), "Developers/" + uid), {
        id: uid
      }).then(() => {
        if (photoURL != null) {
          this.dbstorage.uploadProfilePicture(photoURL, "images/Developers/" + uid).pipe(
            this.hottoast.observe({
              loading: "Image is being uploaded...",
              success: "Image uploaded!",
              error: "There was  an error uploading"
            }), concatMap((photoURL) => this.updateDeveloperImage(photoURL, uid!))
          ).subscribe();
        }
      }).then(() => {
        this.toast.success({ detail: "SUCCESS", summary: "Developer sucessfully added!", duration: 3000 });
        this.spinner.hide();
        this.dialogRef.closeAll();
      });
    })

  }

  updateDeveloperImage(profileData: any, id: any): Observable<any> {
    const user = localStorage.getItem("currentUser");
    const developerRef = ref(getDatabase(), "Developers/" + id);
    get(developerRef).then((snapshot) => {
      const data = snapshot.val();
      update(developerRef, {
        photoURL: profileData
      }).then(() => {
        this.dialogRef.closeAll();
      })
    })
    return of(user).pipe(
    )
  }

  updateDeveloper(developerName: string, id: string) {
    const developerRef = ref(getDatabase(), "Developers/" + id);
    this.spinner.show();
    update(developerRef, {
      developerName: developerName
    }).then(() => {
      this.toast.success({ detail: "SUCCESS", summary: "Developer sucessfully edited!", duration: 3000 });
      this.spinner.hide();
      this.dialogRef.closeAll();
    })
  }

  removeDeveloper(id: any) {
    const devRef = ref(getDatabase(), "Developers/" + id);
    this.spinner.show();
    remove(devRef).then(() => {
      this.toast.success({ detail: "SUCCESS", summary: "Developer sucessfully removed!", duration: 3000 });
      this.spinner.hide();
      this.dialogRef.closeAll();
    })
  }


  loginRecruiter(email: string, password: string) {
    const auth = getAuth();
    const recruiterRef = ref(getDatabase(), "Recruiters/");
    const ref2 = this.db2.database.ref();
    var userFound = false;
    this.spinner.show();
    ref2.child("Recruiters").orderByChild("email").equalTo(email).once("value", snapshot => {
      if (snapshot.exists()) {
        get(recruiterRef).then((snapshot) => {
          snapshot.forEach((snapshot2) => {
            const data = snapshot2.val();
            if (email == data.email) {
              if (data.status == 'activated') {
                userFound = true;
                signInWithEmailAndPassword(auth, email, password).then((userCredentials) => {
                  this.spinner.hide();
                  this.ngZone.run(() => this.router.navigate(["RecruiterDashboard"]));
                  localStorage.setItem("currentUser", userCredentials.user.uid);
                }).catch((error) => {
                  this.spinner.hide();
                  this.toast.error({ detail: "ERROR", summary: "Email/Username or Password is incorrect, Try again!", duration: 3000 });

                })
              }
              else {
                this.spinner.hide();
                this.toast.error({ detail: "ERROR", summary: "Account is deactivated", duration: 3000 });
              }
            }
          });
        });
      }
      else {
        this.spinner.hide();
        this.toast.error({ detail: "ERROR", summary: "Account is not existing", duration: 3000 });
        return;
      }
    })
  }

  getCurrentRecruiter() {
    this.spinner.show();
    var currentUser = localStorage.getItem("currentUser");

    var recruiterObj: any = {};

    const recruiterRef = ref(getDatabase(), "Recruiters/" + currentUser);
    var contactNo: string;
    var newContactNo: string;
    onValue(recruiterRef, ((snapshot) => {
      const data = snapshot.val();

      recruiterObj.recruiterName = data.recruiterName;

      recruiterObj.photoURL = data.photoURL;
      recruiterObj.email = data.email;
      contactNo = data.contactNo;
      newContactNo = contactNo.replace("+63", "");
      recruiterObj.contactNo = newContactNo;
      recruiterObj.companyLogo = data.companyLogo;
      recruiterObj.rating = data.rating;
      recruiterObj.positive = data.rating;
      recruiterObj.negative = data.negative;
      this.spinner.hide();
    }))
    return recruiterObj;
  }


  updateProfilePicRecruiter(profileData: any): Observable<any> {
    const user = localStorage.getItem("currentUser");
    const recruiterRef = ref(getDatabase(), "Recruiters/" + user);
    get(recruiterRef).then((snapshot) => {
      const data = snapshot.val();
      update(recruiterRef, {
        photoURL: profileData
      })
    })
    return of(user).pipe(
    )
  }

  updateRecruiterLogo(profileData: any): Observable<any> {
    const user = localStorage.getItem("currentUser");
    const recruiterRef = ref(getDatabase(), "Recruiters/" + user);
    get(recruiterRef).then((snapshot) => {
      const data = snapshot.val();
      update(recruiterRef, {
        companyLogo: profileData
      })
    })
    return of(user).pipe(
    )
  }

  editRecruiterProfileDetails(recruiterName: string, contactNo: string) {
    const user = this.auth.currentUser;
    this.spinner.show();
    const recruiterRef = ref(getDatabase(), "Recruiters/" + user?.uid);
    get(recruiterRef).then((snapshot) => {
      const data = snapshot.val();
      update(ref(this.db, "Recruiters/" + user?.uid), {
        recruiterName: recruiterName,
        contactNo: contactNo,
      }).then(() => {
        this.spinner.hide();
        this.toast.success({ detail: "SUCCESS", summary: "Account information sucessfully edited", duration: 3000 });
        this.router.navigate(['RecruiterProfile']);
      }).catch(() => {
        this.spinner.hide();
        this.toast.error({ detail: "ERROR", summary: "Something went wrong", duration: 3000 });
      });
    });
  }

  addJobOffer(jobPosition: string, jobDescription: string, location: string, vacancy: string, skills: any, dateAdded: any, dateDuration: any, attachment: any) {
    var recruiterId = localStorage.getItem("currentUser");
    const jobOfferRef = ref(getDatabase(), "Job Offers/" + recruiterId);
    this.spinner.show();
    push(jobOfferRef, {
      jobPosition: jobPosition,
      jobDescription: jobDescription,
      location: location,
      vacancy: vacancy,
      skills: skills,
      dateAdded: dateAdded,
      recruiterId: recruiterId,
      dateDuration: dateDuration,
      status: "active"
    }).then((res) => {
      var id = res.key;
      if (attachment != undefined) {
        this.dbstorage.uploadAttachmentToStorage(attachment, "images/Job Offers/" + id).pipe(
          this.hottoast.observe({
            loading: "Image is being uploaded...",
            success: "Image uploaded!",
            error: "There was  an error uploading"
          }), concatMap((photoURL) => this.updateJobOffer(photoURL, id, recruiterId))
        ).subscribe();
      }
      update(ref(getDatabase(), "Job Offers/" + recruiterId + "/" + id), {
        id: id
      }).then(() => {
        this.spinner.hide();
        this.toast.success({ detail: "SUCCESS", summary: "Job Offer successfully added", duration: 3000 });
        this.dialogRef.closeAll();
      })
    }).catch(() => {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Something went wrong!", duration: 3000 });
      this.dialogRef.closeAll();
    })
  }
  updateJobOffer(attachmentData: string, jobOfferId: any, recruiterId: any): Observable<any> {
    const user = this.auth.currentUser;
    const jobOfferRef = ref(getDatabase(), "Job Offers/" + recruiterId + "/" + jobOfferId);
    update(jobOfferRef, {
      attachment: attachmentData,
    });
    return of(user).pipe(
    )
  }

  editJobOffer(jobPosition: string, jobDescription: string, location: string, vacancy: string, skills: any, id: any, dateDuration: any, attachment: any) {

    var recruiterId = localStorage.getItem("currentUser");
    const jobOfferRef = ref(getDatabase(), "Job Offers/" + recruiterId + "/" + id);
    this.spinner.show();

    update(jobOfferRef, {
      jobPosition: jobPosition,
      jobDescription: jobDescription,
      location: location,
      vacancy: vacancy,
      skills: skills,
      dateDuration: dateDuration
    }).then(() => {
      if (attachment != undefined) {
        this.dbstorage.uploadAttachmentToStorage(attachment, "images/Job Offers/" + id).pipe(
          this.hottoast.observe({
            loading: "Image is being uploaded...",
            success: "Image uploaded!",
            error: "There was  an error uploading"
          }), concatMap((photoURL) => this.updateJobOffer(photoURL, id, recruiterId))
        ).subscribe();
      }
      this.spinner.hide();
      this.toast.success({ detail: "SUCCESS", summary: "Job Offer successfully edited", duration: 3000 });
      this.dialogRef.closeAll();
    }).catch(() => {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Something went wrong!", duration: 3000 });
      this.dialogRef.closeAll();
    })
  }

  archiveJobOffer(id: any) {
    var recruiterId = localStorage.getItem("currentUser");
    const jobOfferRef = ref(getDatabase(), "Job Offers/" + recruiterId + "/" + id);
    this.spinner.show();

    update(jobOfferRef, {
      status: "archived"
    }).then(() => {
      this.spinner.hide();
      this.toast.success({ detail: "SUCCESS", summary: "Job Offer successfully archive", duration: 3000 });
      this.dialogRef.closeAll();
    }).catch(() => {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Something went wrong!", duration: 3000 });
      this.dialogRef.closeAll();
    })
  }

  restoreJobOffer(id: any) {
    var recruiterId = localStorage.getItem("currentUser");
    const jobOfferRef = ref(getDatabase(), "Job Offers/" + recruiterId + "/" + id);
    this.spinner.show();
    update(jobOfferRef, {
      status: "active"
    }).then(() => {
      this.spinner.hide();
      this.toast.success({ detail: "SUCCESS", summary: "Job Offer successfully archive", duration: 3000 });
      this.dialogRef.closeAll();
    }).catch(() => {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Something went wrong!", duration: 3000 });
      this.dialogRef.closeAll();
    })
  }

  studentApplyJobOffer(jobOfferId: any, date: any, recruiterId: any) {
    const studentId = localStorage.getItem("currentUser");
    this.spinner.show()
    const studentJobOfferRef = ref(getDatabase(), "Student Applications/" + studentId + "/")
    const notifRef = ref(getDatabase(), "Notifications/" + recruiterId + "/")
    const studentRef = ref(getDatabase(), "Students/" + studentId)
    var date2: any = new Date();
    var currentDate = formatDate(date2, "yyyy-MM-dd h:MM a", "en-PH", '+8');
    get(studentRef).then((snapshot) => {
      var data = snapshot.val()

      if (data.resume) {
        push(studentJobOfferRef, {
          jobOfferId: jobOfferId,
          studentId: studentId,
          status: "Pending",
          recruiterId: recruiterId,
          date: date
        }).then((res) => {
          const key = res.key
          const studentJobOfferRef2 = ref(getDatabase(), "Student Applications/" + studentId + "/" + key)
          update(studentJobOfferRef2, {
            id: key
          }).then(() => {
            push(notifRef, {
              date: currentDate,
              message: "New Applicant: " + data.Firstname + " " + data.Middlename + " " + data.Lastname,
              jobOfferId: jobOfferId,
              status: "unread",
              companyLogo: data.photoURL
            }).then((res) => {
              var key = res.key
              var newNotifRef = ref(getDatabase(), "Notifications/" + recruiterId + "/" + key)
              update(newNotifRef, {
                id: key
              })
            }).then(() => {
              this.spinner.hide();
              this.ngZone.run(() => this.router.navigate(["StudentApplication"]));
              this.toast.success({ detail: "SUCCESS", summary: "Application submitted", duration: 3000 });
              this.dialogRef.closeAll();
            })

          })
        }).catch((error) => {
          this.spinner.hide();
          this.toast.error({ detail: "ERROR", summary: "Something went wrong!", duration: 3000 });
          this.dialogRef.closeAll();
        })
      }
      else {
        this.spinner.hide();
        this.toast.info({ detail: "Notice", summary: "Resume is required before applying", duration: 3000 });
        this.dialogRef.closeAll();
      }
    })
  }

  studentCancelJobOffer(id: any) {
    const studentId = localStorage.getItem("currentUser")
    this.spinner.show();
    const studentRef = ref(getDatabase(), "Students/" + studentId)
    const studentJobApplicationRef = ref(getDatabase(), "Student Applications/" + studentId + "/" + id)
    var notifRef: any;
    var notifObj: any = {};
    var date2: any = new Date();
    var currentDate = formatDate(date2, "yyyy-MM-dd h:MM a", "en-PH", '+8');
    get(studentJobApplicationRef).then((snapshot) => {
      var data = snapshot.val()
      console.log(snapshot.val())
      notifObj["recruiterId"] = data.recruiterId
      notifRef = ref(getDatabase(), "Notifications/" + data.recruiterId + "/")
    }).then(() => {
      get(studentRef).then((snapshot) => {
        var data = snapshot.val()
        notifObj["Firstname"] = data.Firstname
        notifObj["Middlename"] = data.Middlename
        notifObj["Lastname"] = data.Lastname
        notifObj["photoURL"] = data.photoURL
      }).then(() => {
        remove(studentJobApplicationRef).then(() => {
          this.spinner.hide();
          this.toast.success({ detail: "SUCCESS", summary: "Application successfully cancelled", duration: 3000 });
          this.dialogRef.closeAll();
        }).then(() => {
          push(notifRef, {
            date: currentDate,
            message: "Applicant: " + notifObj.Firstname + " " + notifObj.Middlename + " " + notifObj.Lastname + " cancelled an application",
            status: "unread",
            companyLogo: notifObj.photoURL
          }).then((res) => {
            var key = res.key
            var newNotifRef = ref(getDatabase(), "Notifications/" + notifObj.recruiterId + "/" + key)
            update(newNotifRef, {
              id: key
            })
          })

        })
      })
    }).catch(() => {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Something went wrong!", duration: 3000 });
      this.dialogRef.closeAll();
    })
  }

  recruiterAcceptApplication(studentId: any, jobOfferId: any, recruiterId: any) {
    const jobApplicantRef = ref(getDatabase(), "Student Applications/" + studentId + "/" + jobOfferId)
    const notifRef = ref(getDatabase(), "Notifications/" + studentId + "/")
    const recruiterRef = ref(getDatabase(), "Recruiters/" + recruiterId + "/")
    var date = new Date();
    var currentDate = formatDate(date, "yyyy-MM-dd h:MM a", "en-PH", '+8');
    this.spinner.show();
    update(jobApplicantRef, {
      status: "Processing"
    }).then(() => {
      get(recruiterRef).then((snapshot) => {
        var data = snapshot.val()
        push(notifRef, {
          date: currentDate,
          message: "Your application at " + data.companyName + " had been accepted",
          jobOfferId: jobOfferId,
          status: "unread",
          companyLogo: data.companyLogo
        }).then((res) => {
          var key = res.key
          var newNotifRef = ref(getDatabase(), "Notifications/" + studentId + "/" + key)
          update(newNotifRef, {
            id: key
          })
        })
      }).then(() => {
        this.spinner.hide();
        this.toast.success({ detail: "SUCCESS", summary: "Application successfully accepted", duration: 3000 });
        this.dialogRef.closeAll();
        window.location.reload();
      })
    }).catch(() => {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Something went wrong!", duration: 3000 });
      this.dialogRef.closeAll();
    })
  }
  recruiterRejectApplication(studentId: any, jobOfferId: any, recruiterId: any) {
    const jobApplicantRef = ref(getDatabase(), "Student Applications/" + studentId + "/" + jobOfferId)
    const notifRef = ref(getDatabase(), "Notifications/" + studentId + "/")
    const recruiterRef = ref(getDatabase(), "Recruiters/" + recruiterId + "/")
    var date = new Date();
    var currentDate = formatDate(date, "yyyy-MM-dd h:MM a", "en-PH", '+8');
    this.spinner.show();
    remove(jobApplicantRef).then(() => {
      get(recruiterRef).then((snapshot) => {
        var data = snapshot.val()
        push(notifRef, {
          date: currentDate,
          message: "Your application at " + data.companyName + " had been rejected.",
          jobOfferId: jobOfferId,
          status: "unread",
          companyLogo: data.companyLogo
        }).then((res) => {
          var key = res.key
          var newNotifRef = ref(getDatabase(), "Notifications/" + studentId + "/" + key)
          update(newNotifRef, {
            id: key
          })
        })
      })
    }).then(() => {
      this.spinner.hide();
      this.toast.success({ detail: "SUCCESS", summary: "Application successfully rejected.", duration: 3000 });
      this.dialogRef.closeAll();
    }).catch(() => {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Something went wrong!", duration: 3000 });
      this.dialogRef.closeAll();
    })
  }

  updateResponseAttachment(attachmentData: string, studentId: string, uid: string, responseId: string, attachmentType: any, attachmentName: any): Observable<any> {
    const user = this.auth.currentUser;
    const responseRef = ref(getDatabase(), "Student Applications/" + studentId + "/" + uid + "/" + "messages/" + responseId);
    get(responseRef).then((snapshot) => {
      const data = snapshot.val();
      update(responseRef, {
        date: data.date,
        message: data.message,
        sender: data.sender,
        attachment: attachmentData,
        attachmentType: attachmentType,
        attachmentName: attachmentName

      });
    });
    return of(user).pipe(
    )
  }

  makeResponseRecruiter(uid: string, studentId: string, message: string, attachment: any, attachmentType: any) {
    const user = localStorage.getItem("currentUser");
    const studentApplicationRef = ref(getDatabase(), "Student Applications/" + studentId + "/" + uid + "/" + "messages/");

    var date = new Date();
    var currentDate = formatDate(date, "yyyy-MM-dd h:MM a", "en-PH", '+8');

    if (message != null) {
      push(studentApplicationRef, {
        message: message,
        date: currentDate,
        sender: user
      }).then((res) => {
        const responseKey = res.key;
        if (attachment != null && attachmentType != null) {
          this.dbstorage.uploadAttachmentToStorage(attachment, "images/Response Attachments/" + uid + "/" + responseKey).pipe(
            this.hottoast.observe({
              loading: "Attachment is being uploaded...",
              success: "Attachment uploaded!",
              error: "There was  an error uploading"
            }), concatMap((photoURL) => this.updateResponseAttachment(photoURL, studentId,
              uid!, responseKey!, attachmentType, attachment.name))
          ).subscribe();
        }
      }).then(() => {
        this.toast.success({ detail: "SUCCESS", summary: "Response submitted sucessfully", duration: 3000 });
        this.spinner.hide();
      });
    }
    else {
      push(studentApplicationRef, {
        message: "",
        date: currentDate,
        sender: user
      }).then((res) => {
        const responseKey = res.key;
        if (attachment != null && attachmentType != null) {
          this.dbstorage.uploadAttachmentToStorage(attachment, "images/Response Attachments/" + uid + "/" + responseKey).pipe(
            this.hottoast.observe({
              loading: "Attachment is being uploaded...",
              success: "Attachment uploaded!",
              error: "There was  an error uploading"
            }), concatMap((photoURL) => this.updateResponseAttachment(photoURL, studentId, uid!, responseKey!, attachmentType, attachment.name))
          ).subscribe();
        }
      }).then(() => {
        this.toast.success({ detail: "SUCCESS", summary: "Response submitted sucessfully", duration: 3000 });
        this.spinner.hide();
      });
    }
  }

  confirmHire(id: string, studentId: string, jobOfferId: string, recId: string) {
    this.spinner.show();
    const recruiterId = recId
    const studentApplicantRef = ref(getDatabase(), "Student Applications/" + studentId + "/" + id + "/")
    const jobOfferRef = ref(getDatabase(), "Job Offers/" + recruiterId + "/" + jobOfferId + "/")
    const studentRef = ref(getDatabase(), "Students/" + studentId + "/")
    const notifRef = ref(getDatabase(), "Notifications/" + recruiterId + "/")
    const recruiterRef = ref(getDatabase(), "Recruiters/" + recruiterId + "/")
    var date = new Date();
    var currentDate = formatDate(date, "yyyy-MM-dd h:MM a", "en-PH", '+8');
    get(studentRef).then((snapshot) => {
      var data = snapshot.val()
      if (data.hired != true) {
        push(notifRef, {
          date: currentDate,
          message: data.Firstname + " " + data.Lastname + " accepted the offer",
          jobOfferId: jobOfferId,
          status: "unread",
          companyLogo: data.photoURL
        }).then((res) => {
          var key = res.key
          var newNotifRef = ref(getDatabase(), "Notifications/" + recruiterId + "/" + key)
          update(newNotifRef, {
            id: key
          })
        }).then(() => {
          update(studentApplicantRef, {
            status: "Hired"
          }).then(() => {
            get(jobOfferRef).then((snapshot) => {
              var data = snapshot.val()
              var vacancy = parseInt(data.vacancy)
              vacancy--
              update(jobOfferRef, {
                vacancy: vacancy.toString()
              })
            }).then(() => {
              update(studentRef, {
                hired: true,
                hiredDate: currentDate
              })
            }).then(() => {
              const studentApplicationRef = ref(getDatabase(), "Student Applications/" + studentId + "/")
              get(studentApplicationRef).then((snapshot) => {
                snapshot.forEach((item) => {
                  const data = item.val()
                  if (data.id != id) {
                    const delStudentApplicationRef = ref(getDatabase(), "Student Applications/" + studentId + "/" + data.id + "/")
                    remove(delStudentApplicationRef)
                  }
                })
              }).then(() => {
                this.spinner.hide();
                this.toast.success({ detail: "SUCCESS", summary: "You successfully accepted the offer", duration: 3000 });
                this.dialogRef.closeAll();
                window.location.reload();
              })
            })
          })
        })
      }
      else {
        this.spinner.hide();
        this.toast.info({ detail: "INFO", summary: "You already been hired", duration: 3000 });
        this.dialogRef.closeAll();
      }
    }).catch(() => {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Something went wrong!", duration: 3000 });
      this.dialogRef.closeAll();
    })
  }

  rejectHire(id: string, studentId: string, jobOfferId: string, recId: string) {
    this.spinner.show();
    const recruiterId = recId
    const studentApplicantRef = ref(getDatabase(), "Student Applications/" + studentId + "/" + id + "/")
    const jobOfferRef = ref(getDatabase(), "Job Offers/" + recruiterId + "/" + jobOfferId + "/")
    const studentRef = ref(getDatabase(), "Students/" + studentId + "/")
    const notifRef = ref(getDatabase(), "Notifications/" + recruiterId + "/")
    var date = new Date();
    var currentDate = formatDate(date, "yyyy-MM-dd h:MM a", "en-PH", '+8');
    get(studentRef).then((snapshot) => {
      var data = snapshot.val()
      if (data.hired != true) {
        push(notifRef, {
          date: currentDate,
          message: data.Firstname + " " + data.Lastname + " rejected the offer",
          jobOfferId: jobOfferId,
          status: "unread",
          companyLogo: data.photoURL
        }).then((res) => {
          var key = res.key
          var newNotifRef = ref(getDatabase(), "Notifications/" + recruiterId + "/" + key)
          update(newNotifRef, {
            id: key
          })
        }).then(() => {
          remove(studentApplicantRef).then(() => {
            this.spinner.hide();
            this.toast.success({ detail: "SUCCESS", summary: "You successfully rejected the offer", duration: 3000 });
            this.dialogRef.closeAll();
            window.location.reload();
          })
        })
      }
      else {
        this.spinner.hide();
        this.toast.info({ detail: "INFO", summary: "You already been hired", duration: 3000 });
        this.dialogRef.closeAll();
      }
    }).catch(() => {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Something went wrong!", duration: 3000 });
      this.dialogRef.closeAll();
    })
  }

  hireApplicant(id: string, studentId: string, jobOfferId: string) {
    this.spinner.show();
    const recruiterId = localStorage.getItem("currentUser")
    const studentApplicantRef = ref(getDatabase(), "Student Applications/" + studentId + "/" + id + "/")
    const jobOfferRef = ref(getDatabase(), "Job Offers/" + recruiterId + "/" + jobOfferId + "/")
    const studentRef = ref(getDatabase(), "Students/" + studentId + "/")
    const notifRef = ref(getDatabase(), "Notifications/" + studentId + "/")
    const recruiterRef = ref(getDatabase(), "Recruiters/" + recruiterId + "/")
    var date = new Date();
    var currentDate = formatDate(date, "yyyy-MM-dd h:MM a", "en-PH", '+8');
    get(studentRef).then((snapshot) => {
      var data = snapshot.val()
      if (data.hired != true) {
        get(recruiterRef).then((snapshot) => {
          var data = snapshot.val()
          push(notifRef, {
            date: currentDate,
            message: data.companyName + " wants to hire you, please respond",
            jobOfferId: jobOfferId,
            status: "unread",
            companyLogo: data.companyLogo
          }).then((res) => {
            var key = res.key
            var newNotifRef = ref(getDatabase(), "Notifications/" + studentId + "/" + key)
            update(newNotifRef, {
              id: key
            })
          })
        }).then(() => {
          update(studentApplicantRef, {
            status: "Confirmation"
          }).then(() => {
            this.spinner.hide();
            this.toast.success({ detail: "SUCCESS", summary: "Applicant successfully hired, wait applicant to respond", duration: 3000 });
            this.dialogRef.closeAll();
            window.location.reload();
          })
        })
      }
      else {
        this.spinner.hide();
        this.toast.info({ detail: "INFO", summary: "Applicant is already been hired", duration: 3000 });
        this.dialogRef.closeAll();
      }
    }).catch(() => {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Something went wrong!", duration: 3000 });
      this.dialogRef.closeAll();
    })
  }

  studentSubmitRating(comment: any, recruiterId: any, rating: any) {
    var currentComment = comment
    comment = this.removeUselessWords(comment)

    var filterComment = comment.trim().split(" ")
    var sentimentResult: any;

    sentimentResult = this.sentiment.analyze(comment)

    this.spinner.show();
    var date = new Date();
    var currentDate = formatDate(date, "yyyy-MM-dd h:MM a", "en-PH", '+8');
    const studentId = localStorage.getItem("currentUser")
    const recruiterRatingRef = ref(getDatabase(), "Recruiters/" + recruiterId + "/rating/" + studentId)
    const recruiterRef = ref(getDatabase(), "Recruiters/" + recruiterId)

    if (rating != "") {
      push(recruiterRatingRef, {
        studentId: studentId,
        comment: currentComment,
        date: currentDate,
        rating: rating,
        sentimentResult: sentimentResult
      }).then((res) => {
        update(ref(getDatabase(), "Recruiters/" + recruiterId + "/rating/" + studentId + "/" + res.key), {
          id: res.key
        }).then(() => {
          if (sentimentResult == "Positive") {
            get(recruiterRef).then((snapshot) => {
              var data = snapshot.val()
              var currentPositive = data.positive

              currentPositive++
              update(recruiterRef, {
                positive: currentPositive
              })
            })
          }
          else if (sentimentResult == "Negative") {
            get(recruiterRef).then((snapshot) => {
              var data = snapshot.val()
              var currentNegative = data.negative
              currentNegative++
              update(recruiterRef, {
                negative: currentNegative
              })
            })
          }
        }).then(() => {
          const sentimentRef = ref(getDatabase(), "Sentiment Analyis/" + recruiterId + "/")
          get(sentimentRef).then((snapshot) => {
            filterComment.forEach((item) => {
              if (!snapshot.hasChild(item)) {
                var sentimentObj = {}
                sentimentObj[item] = 1

                update(sentimentRef, sentimentObj)
              } else {
                const sentimentExistRef = ref(getDatabase(), "Sentiment Analyis/" + recruiterId + "/" + item)
                get(sentimentExistRef).then((snapshot) => {
                  var data = snapshot.val()
                  var sentimentExistObj = {}
                  sentimentExistObj[item] = data + 1
                  update(sentimentRef, sentimentExistObj)

                })
              }
            })
          })
          this.spinner.hide();
          this.toast.success({ detail: "SUCCESS", summary: "Review successfully submitted", duration: 3000 });
          this.dialogRef.closeAll();
        })
      }).catch(() => {
        this.spinner.hide();
        this.toast.error({ detail: "ERROR", summary: "Something went wrong!", duration: 3000 });
        this.dialogRef.closeAll();
      })
    }
    else {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Star rating is required", duration: 3000 });
    }
  }

  recruiterSubmitRating(comment: any, studentId: any, rating: any) {
    var currentComment = comment
    comment = this.removeUselessWords(comment)

    var filterComment = comment.trim().split(" ")
    var sentimentResult: any;

    sentimentResult = this.sentiment.analyze(comment)

    this.spinner.show();
    var date = new Date();
    var currentDate = formatDate(date, "yyyy-MM-dd h:MM a", "en-PH", '+8');
    const recruiterId = localStorage.getItem("currentUser")
    const studentRating = ref(getDatabase(), "Students/" + studentId + "/rating/" + recruiterId)
    const studentRef = ref(getDatabase(), "Students/" + studentId)

    if (rating != "") {
      push(studentRating, {
        recruiterId: recruiterId,
        comment: currentComment,
        date: currentDate,
        rating: rating
      }).then((res) => {

        update(ref(getDatabase(), "Students/" + studentId + "/rating/" + recruiterId + "/" + res.key), {
          id: res.key
        }).then(() => {
          if (sentimentResult == "Positive") {
            get(studentRef).then((snapshot) => {
              var data = snapshot.val()
              var currentPositive = data.positive

              currentPositive++
              update(studentRef, {
                positive: currentPositive
              })
            })

          }
          else if (sentimentResult == "Negative") {
            get(studentRef).then((snapshot) => {
              var data = snapshot.val()
              var currentNegative = data.negative
              currentNegative++
              update(studentRef, {
                negative: currentNegative
              })
            })
          }
        }).then(() => {
          this.spinner.hide();
          this.toast.success({ detail: "SUCCESS", summary: "Review successfully submitted", duration: 3000 });
          this.dialogRef.closeAll();
        })

      }).catch(() => {
        this.spinner.hide();
        this.toast.error({ detail: "ERROR", summary: "Something went wrong!", duration: 3000 });
        this.dialogRef.closeAll();
      })
    }
    else {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Star rating is required", duration: 3000 });
    }
  }

  removeUselessWords(comment: any) {
    var uselessWordsArray =
      [
        "a", "at", "be", "can", "cant", "could", "couldnt",
        "do", "does", "how", "i", "in", "is", "many", "much", "of",
        "on", "or", "should", "shouldnt", "so", "such", "the",
        "them", "they", "to", "us", "we", "what", "who", "why", "and",
        "with", "wont", "would", "wouldnt", "you", "all", "another", "any", "anybody", "anyone", "anything", "as", "aught", "both", "each", "each other", "either", "enough", "everybody", "everyone", "everything", "few", "he", "her", "hers", "herself", "him", "himself", "his", "I", "idem", "it", "its", "itself", "many", "me", "mine", "most", "my", "myself", "naught", "neither", "no one", "nobody", "none", "nothing", "nought", "one", "one another", "other", "others", "ought", "our", "ours", "ourself", "ourselves", "several", "she", "some", "somebody", "someone", "something", "somewhat", "such", "suchlike", "that", "thee", "their", "theirs", "theirself", "theirselves", "them", "themself", "themselves", "there", "these", "they", "thine", "this", "those", "thou", "thy", "thyself", "us", "we", "what", "whatever", "whatnot", "whatsoever", "whence", "where", "whereby", "wherefrom", "wherein", "whereinto", "whereof", "whereon", "wherever", "wheresoever", "whereto", "whereunto", "wherewith", "wherewithal", "whether", "which", "whichever", "whichsoever", "who", "whoever", "whom", "whomever", "whomso", "whomsoever", "whose", "whosever", "whosesoever", "whoso", "whosoever", "ye", "yon", "yonder", "you", "your", "yours", "yourself", "yourselves"
      ];

    var expStr = uselessWordsArray.join("|");
    return comment.replace(new RegExp('\\b(' + expStr + ')\\b', 'gi'), ' ')
      .replace(/\s{2,}/g, ' ').replace(/[^a-zA-Z ]/g, "");;
  }

  createAnnouncement(status: string, announcement: string, companyLogo: any) {
    var date2: any = new Date();
    var currentDate = formatDate(date2, "yyyy-MM-dd h:MM a", "en-PH", '+8');
    var currentRecruiter = localStorage.getItem("currentUser")

    const studentApplicationRef = ref(getDatabase(), "Student Applications/")
    var studentList: any = []
    get(studentApplicationRef).then((snapshot) => {
      snapshot.forEach((items) => {
        items.forEach((items2) => {
          var data = items2.val()
          if (data.status == status) {
            var studentId = items.key
            if (!studentList.includes(studentId)) {
              studentList.push(studentId)
            }
          }
        })
      })
    }).then(() => {
      if (studentList.length > 0) {
        studentList.forEach((item: any) => {
          const notifRef = ref(getDatabase(), "Notifications/" + item + "/")
          push(notifRef, {
            date: currentDate,
            message: "ANNOUNCEMENT: " + announcement,
            status: "unread",
            companyLogo: companyLogo,
            isAnnouncement: true
          }).then((res) => {
            var key = res.key
            var newNotifRef = ref(getDatabase(), "Notifications/" + item + "/" + key)
            update(newNotifRef, {
              id: key
            })
          }).then(() => {
            this.spinner.hide();
            this.toast.success({ detail: "SUCCESS", summary: "Announcement successfully sent", duration: 3000 });
            this.dialogRef.closeAll();
          })
        })
      }
      else {
        this.spinner.hide();
        this.toast.error({ detail: "ERROR", summary: "There's no existing " + status.toLowerCase() + " status", duration: 3000 });
        this.dialogRef.closeAll();
      }
    }).catch(() => {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Announcement Failed to send", duration: 3000 });
      this.dialogRef.closeAll();
    })
  }

  createAnnouncementJobPosition(jobPosition: string, announcement: string, companyLogo: any) {
    var date2: any = new Date();
    var currentDate = formatDate(date2, "yyyy-MM-dd h:MM a", "en-PH", '+8');
    var currentRecruiter = localStorage.getItem("currentUser")

    const studentApplicationRef = ref(getDatabase(), "Student Applications/")
    var studentList: any = []
    get(studentApplicationRef).then((snapshot) => {
      snapshot.forEach((items) => {
        items.forEach((items2) => {
          var data = items2.val()
          if (data.jobOfferId == jobPosition) {
            var studentId = items.key
            if (!studentList.includes(studentId)) {
              studentList.push(studentId)
            }
          }
        })
      })
    }).then(() => {
      if (studentList.length > 0) {
        studentList.forEach((item: any) => {
          const notifRef = ref(getDatabase(), "Notifications/" + item + "/")
          push(notifRef, {
            date: currentDate,
            message: "ANNOUNCEMENT: " + announcement,
            status: "unread",
            companyLogo: companyLogo,
            isAnnouncement: true

          }).then((res) => {
            var key = res.key
            var newNotifRef = ref(getDatabase(), "Notifications/" + item + "/" + key)
            update(newNotifRef, {
              id: key
            })
          }).then(() => {
            this.spinner.hide();

            this.toast.success({ detail: "SUCCESS", summary: "Announcement successfully sent", duration: 3000 });
            this.dialogRef.closeAll();
          })
        })
      }
      else {
        this.spinner.hide();
        this.toast.error({ detail: "ERROR", summary: "There's no existing " + status.toLowerCase() + " status", duration: 3000 });
        this.dialogRef.closeAll();
      }
    }).catch(() => {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Announcement Failed to send", duration: 3000 });
      this.dialogRef.closeAll();
    })
  }

  createAnnouncementBoth(jobPosition: string, status: string, announcement: string, companyLogo: any) {
    console.log(jobPosition, status)
    var date2: any = new Date();
    var currentDate = formatDate(date2, "yyyy-MM-dd h:MM a", "en-PH", '+8');
    var currentRecruiter = localStorage.getItem("currentUser")

    const studentApplicationRef = ref(getDatabase(), "Student Applications/")
    var studentList: any = []
    get(studentApplicationRef).then((snapshot) => {
      snapshot.forEach((items) => {
        items.forEach((items2) => {
          var data = items2.val()
          if (data.jobOfferId == jobPosition && data.status == status) {
            var studentId = items.key
            if (!studentList.includes(studentId)) {
              studentList.push(studentId)
            }
          }
        })
      })
    }).then(() => {
      if (studentList.length > 0) {
        studentList.forEach((item: any) => {
          const notifRef = ref(getDatabase(), "Notifications/" + item + "/")
          push(notifRef, {
            date: currentDate,
            message: "ANNOUNCEMENT: " + announcement,
            status: "unread",
            companyLogo: companyLogo,
            isAnnouncement: true

          }).then((res) => {
            var key = res.key
            var newNotifRef = ref(getDatabase(), "Notifications/" + item + "/" + key)
            update(newNotifRef, {
              id: key
            })
          }).then(() => {
            this.spinner.hide();

            this.toast.success({ detail: "SUCCESS", summary: "Announcement successfully sent", duration: 3000 });
            this.dialogRef.closeAll();
          })
        })
      }
      else {
        this.spinner.hide();
        this.toast.error({ detail: "ERROR", summary: "Recipient is empty", duration: 3000 });
        this.dialogRef.closeAll();
      }
    }).catch(() => {
      this.spinner.hide();
      this.toast.error({ detail: "ERROR", summary: "Announcement Failed to send", duration: 3000 });
      this.dialogRef.closeAll();
    })
  }

  getSentimentData() {
    var recruiterId = localStorage.getItem("currentUser")
    const recruiterRef = ref(getDatabase(), "Sentiment Analyis/" + recruiterId)
    const rootRecruiterRef = ref(getDatabase(), "Sentiment Analyis/")
    var sentimentData: any = []
    get(rootRecruiterRef).then((snapshot) => {
      if (snapshot.hasChild(recruiterId!)) {
        get(recruiterRef).then((snapshot) => {
          var data = snapshot.val()
          Object.entries(data).forEach(([key, value]) => {
            var sentimentObj = {}
            sentimentObj["text"] = String(key)
            sentimentObj["value"] = Number(value) + 25
            sentimentData.push(sentimentObj)
          })
        })
      }
    })
    return sentimentData
  }

  getSentimentDataStudentView(recruiterId: any) {
    const recruiterRef = ref(getDatabase(), "Sentiment Analyis/" + recruiterId)
    const rootRecruiterRef = ref(getDatabase(), "Sentiment Analyis/")
    var sentimentData: any = []
    get(rootRecruiterRef).then((snapshot) => {
      if (snapshot.hasChild(recruiterId)) {
        get(recruiterRef).then((snapshot) => {
          var data = snapshot.val()
          Object.entries(data).forEach(([key, value]) => {
            var sentimentObj = {}
            sentimentObj["text"] = String(key)
            sentimentObj["value"] = Number(value) + 25
            sentimentData.push(sentimentObj)
          })
        })
      }
    })
    return sentimentData
  }
}
