import type {SportFacts} from '../types/app';

export const facts: SportFacts[] = [
  {
    sportId: 'football',
    facts: [
      {
        title: 'Fastest Goal',
        body: 'The fastest goal in football history was scored just seconds after the kick-off whistle. In some matches, players immediately shot from the center of the field, using surprise as a major advantage. This shows that even the first seconds of the game can be decisive if you act quickly and boldly.',
      },
      {
        title: 'Red Card Origin',
        body: 'Yellow and red cards only appeared in 1970 after problems at international matches, where players did not always understand the referees due to language barriers. The color system became a universal way of communication, which is understandable in any country without translation.',
      },
      {
        title: 'Ball Evolution',
        body: 'The first soccer balls looked completely different from modern ones. They were made of leather, and an inflated animal bladder was inserted inside. Such balls were uneven, heavy and often changed shape during the game, which made control much more difficult.',
      },
      {
        title: 'Longest Match',
        body: 'Some football matches lasted much longer than the standard 90 minutes. Due to extra time, breaks or even unusual conditions, the game could drag on for several hours, which required maximum endurance and concentration from the players.',
      },
      {
        title: 'World Popularity',
        body: 'Football is considered the most popular sport in the world. According to various estimates, more than 4 billion people regularly watch matches or play themselves. Its simple rules and accessibility have made the game a global phenomenon.',
      },
    ],
  },
  {
    sportId: 'volleyball',
    facts: [
      {
        title: 'Soft Start',
        body: 'Volleyball was originally called “Mintonette” and was created as a less intense alternative to basketball for adult players. Over time, the game became more dynamic, and the new name “volleyball” better reflected its essence - a game with a ball in the air.',
      },
      {
        title: 'High Jump Game',
        body: 'Professional volleyball players can jump to a height of more than 1 meter during an attack or block. This allows them to perform powerful overhead shots and effectively defend, making the game spectacular and very fast.',
      },
      {
        title: 'No Holding Rule',
        body: 'One of the main features of volleyball is that the ball cannot be held in the hands. Each touch must be short and precise, which develops the coordination and reaction of the players.',
      },
      {
        title: 'Beach Popularity',
        body: 'Beach volleyball became an Olympic sport in 1996. It is distinguished by a smaller number of players and is played on sand, which makes it more physically demanding and even more spectacular.',
      },
      {
        title: 'Team Touch Limit',
        body: "In volleyball, a team has only three touches to pass the ball to the opponent's side. This forces players to make quick decisions and work as a unit.",
      },
    ],
  },
  {
    sportId: 'basketball',
    facts: [
      {
        title: 'Peach Basket Start',
        body: 'The first basketball baskets were ordinary peach baskets. After each hit, the ball had to be retrieved by hand, which significantly slowed down the game.',
      },
      {
        title: 'No Dribble Early',
        body: 'In the early days of basketball, dribbling was not allowed, as it is now. Players could only pass the ball to each other, and dribbling emerged as a key element of the game over time.',
      },
      {
        title: 'Tall Advantage',
        body: 'Height plays an important role in basketball. The tallest professional players can reach over 2.2 meters, which gives them a significant advantage under the hoop.',
      },
      {
        title: 'Shot Clock Rule',
        body: 'The 24-second rule was introduced to make the game faster and more interesting. A team must make a shot within this time, otherwise the ball goes to the opponent.',
      },
      {
        title: 'Global Game',
        body: 'Basketball is one of the most popular sports in the world. It is actively developing not only in the United States, but also in Europe, Asia and other regions.',
      },
    ],
  },
  {
    sportId: 'tennis',
    facts: [
      {
        title: 'Royal Roots',
        body: 'Tennis has royal origins and was once popular among European nobility. Its early versions were played indoors.',
      },
      {
        title: 'Strange Score',
        body: 'The 15-30-40 scoring system has historical origins and is not random. It is related to ancient ways of counting time or points.',
      },
      {
        title: 'Longest Match',
        body: 'The longest tennis match lasted over 11 hours and was divided into several days. It is a real test of endurance and strength of mind.',
      },
      {
        title: 'Ball Pressure',
        body: 'Tennis balls have a special pressure inside, which ensures their bounce. Over time, this pressure decreases, so the balls are regularly changed during matches.',
      },
      {
        title: 'Court Types',
        body: 'Tennis is played on different surfaces - grass, clay and hard. Each of them affects the speed of the ball and the style of play.',
      },
    ],
  },
  {
    sportId: 'handball',
    facts: [
      {
        title: 'Fast Pace Sport',
        body: 'Handball is one of the fastest team sports. Players are constantly moving, attacking and defending, which makes the game very intense.',
      },
      {
        title: '3 Step Rule',
        body: 'A player can only take three steps with the ball without dribbling. This rule forces quick decision-making and passing.',
      },
      {
        title: 'High Scoring Game',
        body: 'Handball is often a high-scoring game, with scores exceeding 30 goals per game. This makes the matches very dynamic.',
      },
      {
        title: 'Strong Throws',
        body: 'Professional players can throw the ball at speeds of over 100 km/h. This requires instant reactions from goalkeepers.',
      },
      {
        title: 'Olympic Sport',
        body: 'Handball is an Olympic sport and is very popular in Europe. The Scandinavian and Balkan countries have particularly strong teams.',
      },
    ],
  },
];

export const allFacts = facts.flatMap(group =>
  group.facts.map(fact => ({...fact, sportId: group.sportId})),
);
