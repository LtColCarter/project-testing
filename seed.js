const {InfoPage} = require('./models/infoPage');
const {User} = require('./models/user');
const {Story} = require('./models/story');
const bcrypt = require('bcrypt');
const config = require('config');
const mongoose = require('mongoose');

const stories = [
    {
        title: 'The Old Elvet Bridge',
        text: ['The Elvet Bridge was built during the twelfth and thirteenth centuries by Bishop Hugh de Puisat. Locals were encouraged to help with the construction of the bridge by granting them “indulgences”; effectively a promise from the Church that people who worked on the bridge would suffer less for their sins.', '', 'Although only ten arches of the bridge are visible in modern times, some historians believe that there were originally fourteen. The four mysterious missing arches could be hidden somewhere beneath Durham, buried underneath the construction of the town at some point in the past seven hundred years, but no attempt has been made to uncover them because this would require significant archaeological work in Durham’s busy town centre.', '', 'Over time, the structure of the bridge was incorporated into surrounding buildings until it was indistinguishable from the town around it. At either end stood two chapels, the proceeds from which were used to maintain the bridge. These days, it is flanked by chapels of a different kind, in the form of the seedy Klute nightclub at one end and the Swan & Three Cygnets at the other, and maintained by the Durham City council. At one point there was also a gatehouse. There used to be several houses and businesses on the bridge itself, but after a series of disastrous collapses the remaining houses on the bridge were deemed unsafe and demolished in 1760.', '', 'In 1975, the New Elvet road bridge was constructed so that modern vehicles wouldn’t have to use the ancient bridge, and the original Elvet Bridge was pedestrianised. On the opposite side of the peninsula, the Milburngate Bridge was constructed as a road replacement for the similarly ancient Framwellgate Bridge.'],
        author: 'Reuben',
        xCoordinate: "80",
        yCoordinate: "18"
    },
    {
        title: 'Prebends Bridge',
        video: 'https://www.youtube.com/embed/bhC6xOmoArk',
        text: ['Prebends Bridge was built between the years 1772 and 1778 on the instructions of the Dean of Durham and served as a private road for the Dean and Chapter of Durham, giving access from the south through the city\'s Watergate.'],
        author: 'Reuben',
        xCoordinate: "20",
        yCoordinate: "74"
    },
    {
        title: 'The Fulling Mills',
        image: 'https://photos.francisfrith.com/frith/durham-the-old-fulling-mill-1892_30734m.jpg',
        text: ['Two corn mills stood at the east end of the weir. They were owned by the Bishop of Durham and were called Jesus Mill and Lead Mill. One of the mills became a fulling mill in the 18th century and fell into disuse in the early 19th century. The building later became Durham University\'s Museum of Archaeology, but has since closed.'],
        author: 'Reuben',
        xCoordinate: "27",
        yCoordinate: "53"
    },
    {
        title: 'Durham Castle',
        audio: 'https://www.supremecourt.uk/files/supreme-court-guide-podcast.mp3',
        text: ['Durham Castle began construction in 1072 following the Norman invasion, under the orders of William the Conqueror. It became the home of the Bishop of Durham. In 1837, the building was occupied by Durham University and has been used as a college ever since, housing over a hundred students.'],
        author: 'Reuben',
        xCoordinate: "54",
        yCoordinate: "23"
    }
];

async function seed() {

    // const db = config.get('dbA') + config.get('dbLogin') + ':' + config.get('dbPassword') + config.get('dbB');
    const db = config.get('db');
    mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

    await InfoPage.deleteMany({});
    await User.deleteMany({});
    await Story.deleteMany({});

    await new InfoPage({
        title: 'Volunteer with DREAM Heritage',
        link: 'https://signup.com/go/seRSGwO',
        text: "We couldn't do our work without volunteers, whether it's taking part in community outreach projects or keeping heritage sites clean and tidy. We look forward to hearing from you and having you volunteer with us!",
        pageType: 'volunteer'
    }).save();

    await new InfoPage({
        title: 'Donation to DREAM Heritage',
        link: 'https://www.gofundme.com/f/039pride-of-place039-in-county-durham?rcid=r01-156846658533-30322af6b32546e1&pc=ot_co_campmgmt_w',
        text: 'We are a social enterprise delivering community heritage projects and archaeological excavations to save and transform unloved heritage sites into community spaces. In doing so we hope to transform society, promoting community, well-being and heritage over GDP and growth, and founding in both the old and young an appreciation towards both their natural and historic landscape to ensure the care of these places for future generations.',
        pageType: 'donation'
    }).save();

    let password = 'password';

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    await new User({
        name: 'admin',
        email: 'blubirdurham@gmail.com',
        password
    }).save();

    for (const story of stories) {

        await new Story({
            title: story.title,
            author: story.author,
            text: story.text,
            audio: story.audio,
            video: story.video,
            image: story.image,
            xCoordinate: story.xCoordinate,
            yCoordinate: story.yCoordinate
        }).save()
    }

    await mongoose.disconnect();
}

seed();