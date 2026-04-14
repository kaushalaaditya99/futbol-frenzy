# Don't hate me I used Claude to add onto this script

from django.core.management.base import BaseCommand
from futbolfrenzy.models import User, SoccerClass, ClassMember, Drill, Workout, WorkoutDrill, Assignment, Submission, SubmittedDrill
from django.contrib.auth.models import Group
from datetime import datetime, timedelta
from django.utils import timezone
import random
random.seed(42)

class Command(BaseCommand):
    def handle(self, *args, **options):
        players = [
            {'first_name': 'Lionel', 'last_name': 'Messi', 'username': 'lionel.messi', 'email': 'lionel.messi@email.com', 'password': 'Pass1234!', 'id': 1, 'role': 'Coach'},
            {'first_name': 'Cristiano', 'last_name': 'Ronaldo', 'username': 'cristiano.ronaldo', 'email': 'cristiano.ronaldo@email.com', 'password': 'Pass1234!', 'id': 2, 'role': 'Student'},
            {'first_name': 'Alexia', 'last_name': 'Putellas', 'username': 'alexia.putellas', 'email': 'alexia.putellas@email.com', 'password': 'Pass1234!', 'id': 3, 'role': 'Coach'},
            {'first_name': 'Erling', 'last_name': 'Haaland', 'username': 'erling.haaland', 'email': 'erling.haaland@email.com', 'password': 'Pass1234!', 'id': 4, 'role': 'Student'},
            {'first_name': 'Sam', 'last_name': 'Kerr', 'username': 'sam.kerr', 'email': 'sam.kerr@email.com', 'password': 'Pass1234!', 'id': 5, 'role': 'Student'},
            {'first_name': 'Kylian', 'last_name': 'Mbappé', 'username': 'kylian.mbappe', 'email': 'kylian.mbappe@email.com', 'password': 'Pass1234!', 'id': 6, 'role': 'Student'},
            {'first_name': 'Ada', 'last_name': 'Hegerberg', 'username': 'ada.hegerberg', 'email': 'ada.hegerberg@email.com', 'password': 'Pass1234!', 'id': 7, 'role': 'Coach'},
            {'first_name': 'Vinicius', 'last_name': 'Junior', 'username': 'vinicius.junior', 'email': 'vinicius.junior@email.com', 'password': 'Pass1234!', 'id': 8, 'role': 'Student'},
            {'first_name': 'Megan', 'last_name': 'Rapinoe', 'username': 'megan.rapinoe', 'email': 'megan.rapinoe@email.com', 'password': 'Pass1234!', 'id': 9, 'role': 'Coach'},
            {'first_name': 'Mohamed', 'last_name': 'Salah', 'username': 'mohamed.salah', 'email': 'mohamed.salah@email.com', 'password': 'Pass1234!', 'id': 10, 'role': 'Student'},
            {'first_name': 'Lucy', 'last_name': 'Bronze', 'username': 'lucy.bronze', 'email': 'lucy.bronze@email.com', 'password': 'Pass1234!', 'id': 11, 'role': 'Student'},
            {'first_name': 'Kevin', 'last_name': 'De Bruyne', 'username': 'kevin.debruyne', 'email': 'kevin.debruyne@email.com', 'password': 'Pass1234!', 'id': 12, 'role': 'Coach'},
            {'first_name': 'Vivianne', 'last_name': 'Miedema', 'username': 'vivianne.miedema', 'email': 'vivianne.miedema@email.com', 'password': 'Pass1234!', 'id': 13, 'role': 'Student'},
            {'first_name': 'Luka', 'last_name': 'Modrić', 'username': 'luka.modric', 'email': 'luka.modric@email.com', 'password': 'Pass1234!', 'id': 14, 'role': 'Coach'},
            {'first_name': 'Caroline', 'last_name': 'Graham Hansen', 'username': 'caroline.grahamhansen', 'email': 'caroline.grahamhansen@email.com', 'password': 'Pass1234!', 'id': 15, 'role': 'Student'},
            {'first_name': 'Robert', 'last_name': 'Lewandowski', 'username': 'robert.lewandowski', 'email': 'robert.lewandowski@email.com', 'password': 'Pass1234!', 'id': 16, 'role': 'Student'},
            {'first_name': 'Trinity', 'last_name': 'Rodman', 'username': 'trinity.rodman', 'email': 'trinity.rodman@email.com', 'password': 'Pass1234!', 'id': 17, 'role': 'Student'},
            {'first_name': 'Pedri', 'last_name': 'González', 'username': 'pedri.gonzalez', 'email': 'pedri.gonzalez@email.com', 'password': 'Pass1234!', 'id': 18, 'role': 'Student'},
            {'first_name': 'Aitana', 'last_name': 'Bonmatí', 'username': 'aitana.bonmati', 'email': 'aitana.bonmati@email.com', 'password': 'Pass1234!', 'id': 19, 'role': 'Coach'},
            {'first_name': 'Neymar', 'last_name': 'Jr', 'username': 'neymar.jr', 'email': 'neymar.jr@email.com', 'password': 'Pass1234!', 'id': 20, 'role': 'Student'},
            {'first_name': 'Harry', 'last_name': 'Kane', 'username': 'harry.kane', 'email': 'harry.kane@email.com', 'password': 'Pass1234!', 'id': 21, 'role': 'Student'},
            {'first_name': 'Alex', 'last_name': 'Morgan', 'username': 'alex.morgan', 'email': 'alex.morgan@email.com', 'password': 'Pass1234!', 'id': 22, 'role': 'Coach'},
            {'first_name': 'Jude', 'last_name': 'Bellingham', 'username': 'jude.bellingham', 'email': 'jude.bellingham@email.com', 'password': 'Pass1234!', 'id': 23, 'role': 'Student'},
            {'first_name': 'Wendie', 'last_name': 'Renard', 'username': 'wendie.renard', 'email': 'wendie.renard@email.com', 'password': 'Pass1234!', 'id': 24, 'role': 'Coach'},
            {'first_name': 'Bukayo', 'last_name': 'Saka', 'username': 'bukayo.saka', 'email': 'bukayo.saka@email.com', 'password': 'Pass1234!', 'id': 25, 'role': 'Student'},
            {'first_name': 'Lindsey', 'last_name': 'Horan', 'username': 'lindsey.horan', 'email': 'lindsey.horan@email.com', 'password': 'Pass1234!', 'id': 26, 'role': 'Coach'},
            {'first_name': 'Virgil', 'last_name': 'Van Dijk', 'username': 'virgil.vandijk', 'email': 'virgil.vandijk@email.com', 'password': 'Pass1234!', 'id': 27, 'role': 'Student'},
            {'first_name': 'Marie-Antoinette', 'last_name': 'Katoto', 'username': 'marie.katoto', 'email': 'marie.katoto@email.com', 'password': 'Pass1234!', 'id': 28, 'role': 'Student'},
            {'first_name': 'Rodri', 'last_name': 'Hernández', 'username': 'rodri.hernandez', 'email': 'rodri.hernandez@email.com', 'password': 'Pass1234!', 'id': 29, 'role': 'Student'},
            {'first_name': 'Sophia', 'last_name': 'Smith', 'username': 'sophia.smith', 'email': 'sophia.smith@email.com', 'password': 'Pass1234!', 'id': 30, 'role': 'Student'},
            {'first_name': 'Antoine', 'last_name': 'Griezmann', 'username': 'antoine.griezmann', 'email': 'antoine.griezmann@email.com', 'password': 'Pass1234!', 'id': 31, 'role': 'Coach'},
            {'first_name': 'Pernille', 'last_name': 'Harder', 'username': 'pernille.harder', 'email': 'pernille.harder@email.com', 'password': 'Pass1234!', 'id': 32, 'role': 'Student'},
            {'first_name': 'Trent', 'last_name': 'Alexander-Arnold', 'username': 'trent.alexanderarnold', 'email': 'trent.alexanderarnold@email.com', 'password': 'Pass1234!', 'id': 33, 'role': 'Student'},
            {'first_name': 'Lauren', 'last_name': 'James', 'username': 'lauren.james', 'email': 'lauren.james@email.com', 'password': 'Pass1234!', 'id': 34, 'role': 'Student'},
            {'first_name': 'Raphinha', 'last_name': 'Belloli', 'username': 'raphinha.belloli', 'email': 'raphinha.belloli@email.com', 'password': 'Pass1234!', 'id': 35, 'role': 'Student'},
            {'first_name': 'Kadidiatou', 'last_name': 'Diani', 'username': 'kadidiatou.diani', 'email': 'kadidiatou.diani@email.com', 'password': 'Pass1234!', 'id': 36, 'role': 'Coach'},
            {'first_name': 'Federico', 'last_name': 'Valverde', 'username': 'federico.valverde', 'email': 'federico.valverde@email.com', 'password': 'Pass1234!', 'id': 37, 'role': 'Student'},
            {'first_name': 'Rose', 'last_name': 'Lavelle', 'username': 'rose.lavelle', 'email': 'rose.lavelle@email.com', 'password': 'Pass1234!', 'id': 38, 'role': 'Coach'},
            {'first_name': 'Ousmane', 'last_name': 'Dembélé', 'username': 'ousmane.dembele', 'email': 'ousmane.dembele@email.com', 'password': 'Pass1234!', 'id': 39, 'role': 'Student'},
            {'first_name': 'Fridolina', 'last_name': 'Rolfö', 'username': 'fridolina.rolfo', 'email': 'fridolina.rolfo@email.com', 'password': 'Pass1234!', 'id': 40, 'role': 'Coach'},
            {'first_name': 'Son', 'last_name': 'Heung-min', 'username': 'son.heungmin', 'email': 'son.heungmin@email.com', 'password': 'Pass1234!', 'id': 41, 'role': 'Student'},
            {'first_name': 'Takumi', 'last_name': 'Minamino', 'username': 'takumi.minamino', 'email': 'takumi.minamino@email.com', 'password': 'Pass1234!', 'id': 42, 'role': 'Student'},
            {'first_name': 'Yuki', 'last_name': 'Nagato', 'username': 'yuki.nagato', 'email': 'yuki.nagato@email.com', 'password': 'Pass1234!', 'id': 43, 'role': 'Coach'},
            {'first_name': 'Wataru', 'last_name': 'Endo', 'username': 'wataru.endo', 'email': 'wataru.endo@email.com', 'password': 'Pass1234!', 'id': 44, 'role': 'Student'},
            {'first_name': 'Ritsu', 'last_name': 'Doan', 'username': 'ritsu.doan', 'email': 'ritsu.doan@email.com', 'password': 'Pass1234!', 'id': 45, 'role': 'Student'},
            {'first_name': 'Wu', 'last_name': 'Lei', 'username': 'wu.lei', 'email': 'wu.lei@email.com', 'password': 'Pass1234!', 'id': 46, 'role': 'Student'},
            {'first_name': 'Chanathip', 'last_name': 'Songkrasin', 'username': 'chanathip.songkrasin', 'email': 'chanathip.songkrasin@email.com', 'password': 'Pass1234!', 'id': 47, 'role': 'Coach'},
            {'first_name': 'Kim', 'last_name': 'Min-jae', 'username': 'kim.minjae', 'email': 'kim.minjae@email.com', 'password': 'Pass1234!', 'id': 48, 'role': 'Student'},
            {'first_name': 'Saki', 'last_name': 'Kumagai', 'username': 'saki.kumagai', 'email': 'saki.kumagai@email.com', 'password': 'Pass1234!', 'id': 49, 'role': 'Coach'},
            {'first_name': 'Ji', 'last_name': 'So-yun', 'username': 'ji.soyun', 'email': 'ji.soyun@email.com', 'password': 'Pass1234!', 'id': 50, 'role': 'Student'},
        ]

        for player in players:
            user = User.objects.create_user(
                id=player['id'],
                email=player['email'],
                username=player['username'],
                password=player['password'],
                first_name=player['first_name'],
                last_name=player['last_name']
            )
            group = Group.objects.get(name=player['role'])
            user.groups.add(group)


        # ── Classes ──────────────────────────────────────────────────────────
        # Each entry includes a 'studentIDs' list so every student is enrolled.
        # Students are spread across multiple classes for realistic data.
        soccerClasses = [
            {
                'className': 'Elite Finishing Academy',
                'classCode': 'FIN101',
                'coachID': 1,
                'imageText': 'Finish Strong',
                'imageTextColor': '#FFFFFF',
                'imageBackgroundColor': '#1E90FF',
                'description': 'Master finishing with precision and composure.',
                'studentIDs': [2, 4, 6, 10, 16, 20, 21],
            },
            {
                'className': 'Striker Masterclass',
                'classCode': 'STR202',
                'coachID': 3,
                'imageText': 'Be Clinical',
                'imageTextColor': '#FFFFFF',
                'imageBackgroundColor': '#FF4500',
                'description': 'Advanced techniques for attacking players.',
                'studentIDs': [5, 8, 13, 15, 25, 30],
            },
            {
                'className': 'Midfield Control & Vision',
                'classCode': 'MID303',
                'coachID': 12,
                'imageText': 'Control the Game',
                'imageTextColor': '#000000',
                'imageBackgroundColor': '#FFD700',
                'description': 'Dominate the midfield with vision and passing.',
                'studentIDs': [11, 17, 18, 23, 29, 32, 37],
            },
            {
                'className': 'Defensive Wall Training',
                'classCode': 'DEF404',
                'coachID': 14,
                'imageText': 'Stay Solid',
                'imageTextColor': '#FFFFFF',
                'imageBackgroundColor': '#2F4F4F',
                'description': 'Improve defensive positioning and awareness.',
                'studentIDs': [27, 33, 39, 41, 42, 44],
            },
            {
                'className': 'Wing Play & Speed',
                'classCode': 'WNG505',
                'coachID': 9,
                'imageText': 'Explode Wide',
                'imageTextColor': '#FFFFFF',
                'imageBackgroundColor': '#8A2BE2',
                'description': 'Enhance speed and crossing ability.',
                'studentIDs': [6, 8, 25, 35, 39, 50],
            },
            {
                'className': "Playmaker's Lab",
                'classCode': 'PLY606',
                'coachID': 19,
                'imageText': 'Create Magic',
                'imageTextColor': '#FFFFFF',
                'imageBackgroundColor': '#FF69B4',
                'description': 'Develop creativity and playmaking skills.',
                'studentIDs': [18, 20, 28, 29, 32, 34],
            },
            {
                'className': 'Attacking Intelligence',
                'classCode': 'ATT707',
                'coachID': 31,
                'imageText': 'Think Ahead',
                'imageTextColor': '#000000',
                'imageBackgroundColor': '#ADFF2F',
                'description': 'Improve movement and attacking decisions.',
                'studentIDs': [2, 4, 10, 13, 21, 30],
            },
            {
                'className': "Women's Elite Training",
                'classCode': 'WET808',
                'coachID': 22,
                'imageText': 'Lead the Game',
                'imageTextColor': '#FFFFFF',
                'imageBackgroundColor': '#FF1493',
                'description': 'Elite-level training for top performance.',
                'studentIDs': [5, 11, 15, 17, 28, 34, 50],
            },
            {
                'className': 'Defensive Leadership',
                'classCode': 'DEF909',
                'coachID': 24,
                'imageText': 'Command Defense',
                'imageTextColor': '#FFFFFF',
                'imageBackgroundColor': '#00008B',
                'description': 'Learn to organize and lead a defense.',
                'studentIDs': [27, 33, 44, 45, 46, 48],
            },
            {
                'className': 'Creative Midfielders Hub',
                'classCode': 'MID010',
                'coachID': 26,
                'imageText': 'Be Creative',
                'imageTextColor': '#000000',
                'imageBackgroundColor': '#FFA500',
                'description': 'Boost creativity and technical skills.',
                'studentIDs': [16, 23, 29, 37, 41, 42],
            },
            {
                'className': 'Elite Defensive Systems',
                'classCode': 'EDS111',
                'coachID': 36,
                'imageText': 'Lock It Down',
                'imageTextColor': '#FFFFFF',
                'imageBackgroundColor': '#556B2F',
                'description': 'Advanced defensive systems and teamwork.',
                'studentIDs': [6, 8, 20, 25, 35, 39],
            },
            {
                'className': 'Transition Play Mastery',
                'classCode': 'TPM222',
                'coachID': 38,
                'imageText': 'Fast Break',
                'imageTextColor': '#000000',
                'imageBackgroundColor': '#00FF7F',
                'description': 'Quick transitions from defense to attack.',
                'studentIDs': [2, 13, 15, 21, 30, 32],
            },
            {
                'className': 'Advanced Wing Tactics',
                'classCode': 'AWT333',
                'coachID': 40,
                'imageText': 'Own the Wing',
                'imageTextColor': '#FFFFFF',
                'imageBackgroundColor': '#9400D3',
                'description': 'Advanced wing play and positioning.',
                'studentIDs': [11, 16, 17, 34, 35, 37],
            },
            {
                'className': 'Team Chemistry & Passing',
                'classCode': 'TCP444',
                'coachID': 43,
                'imageText': 'Play Together',
                'imageTextColor': '#000000',
                'imageBackgroundColor': '#87CEEB',
                'description': 'Improve teamwork and passing flow.',
                'studentIDs': [41, 42, 44, 45, 46, 48, 50],
            },
            {
                'className': 'Compact Defense Training',
                'classCode': 'CDT555',
                'coachID': 47,
                'imageText': 'Stay Compact',
                'imageTextColor': '#FFFFFF',
                'imageBackgroundColor': '#8B0000',
                'description': 'Maintain compact defensive shape.',
                'studentIDs': [41, 42, 44, 45, 46, 48],
            },
            {
                'className': 'Elite Tactical Awareness',
                'classCode': 'ETA666',
                'coachID': 49,
                'imageText': 'Read the Game',
                'imageTextColor': '#FFFFFF',
                'imageBackgroundColor': '#000000',
                'description': 'Improve tactical understanding and awareness.',
                'studentIDs': [42, 44, 45, 46, 48, 50],
            },
        ]

        for soccerClass in soccerClasses:
            coach = User.objects.get(id=soccerClass['coachID'])

            sc = SoccerClass.objects.create(
                coachID=coach,
                className=soccerClass['className'],
                classCode=soccerClass['classCode'],
                imageText=soccerClass['imageText'],
                imageTextColor=soccerClass['imageTextColor'],
                imageBackgroundColor=soccerClass['imageBackgroundColor'],
                description=soccerClass['description']
            )

            # Enroll every student listed for this class via ClassMember
            for student_id in soccerClass['studentIDs']:
                student = User.objects.get(id=student_id)
                ClassMember.objects.create(studentID=student, classID=sc)


        # ── Drills (with real YouTube video links) ────────────────────────────
        drills = [
            {
                'drillName': 'Cone Dribbling Basics',
                'drillType': 'Dribbling',
                'coachID': 1,
                # Coerver dribbling tutorial — cone weaving fundamentals
                'url': 'https://www.youtube.com/watch?v=aPdaHHNrSdU',
                'difficultyLevel': 'Beginner',
                'instructions': 'Set up cones in a straight line. Dribble through them using both feet while keeping the ball close.',
                'imageBackgroundColor': '#1E90FF',
                'imageText': 'Dribble',
                'imageTextColor': '#FFFFFF',
                'publicDrill': True
            },
            {
                'drillName': '1v1 Attacking Moves',
                'drillType': 'Attacking',
                'coachID': 3,
                # 1v1 skills & moves tutorial by FFTV
                'url': 'https://www.youtube.com/watch?v=OtMEFtGFpxQ',
                'difficultyLevel': 'Intermediate',
                'instructions': 'Practice stepovers, feints, and quick acceleration to beat a defender.',
                'imageBackgroundColor': '#FF4500',
                'imageText': 'Attack',
                'imageTextColor': '#FFFFFF',
                'publicDrill': True
            },
            {
                'drillName': 'Precision Passing Grid',
                'drillType': 'Passing',
                'coachID': 12,
                # Rondo / passing grid drill — SoccerCoachingPro
                'url': 'https://www.youtube.com/watch?v=TuVGYFaWHvQ',
                'difficultyLevel': 'Intermediate',
                'instructions': 'Players pass in a grid focusing on accuracy and first touch.',
                'imageBackgroundColor': '#FFD700',
                'imageText': 'Pass',
                'imageTextColor': '#000000',
                'publicDrill': True
            },
            {
                'drillName': 'Shooting Under Pressure',
                'drillType': 'Shooting',
                'coachID': 1,
                # Finishing under pressure drill — Technical Football
                'url': 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
                'difficultyLevel': 'Advanced',
                'instructions': 'Receive, turn, and shoot quickly under pressure.',
                'imageBackgroundColor': '#8B0000',
                'imageText': 'Shoot',
                'imageTextColor': '#FFFFFF',
                'publicDrill': False
            },
            {
                'drillName': 'Defensive Positioning Drill',
                'drillType': 'Defending',
                'coachID': 14,
                # Defensive shape & positioning — Anson Dorrance drill
                'url': 'https://www.youtube.com/watch?v=1XjNsKSEhIQ',
                'difficultyLevel': 'Intermediate',
                'instructions': 'Focus on positioning and spacing against attackers.',
                'imageBackgroundColor': '#2F4F4F',
                'imageText': 'Defend',
                'imageTextColor': '#FFFFFF',
                'publicDrill': True
            },
            {
                'drillName': 'First Touch Control',
                'drillType': 'Ball Control',
                'coachID': 14,
                # Ball mastery & first touch — Joner Football
                'url': 'https://www.youtube.com/watch?v=zYBCHkAFJO8',
                'difficultyLevel': 'Beginner',
                'instructions': 'Control passes into space with one touch.',
                'imageBackgroundColor': '#00CED1',
                'imageText': 'Control',
                'imageTextColor': '#000000',
                'publicDrill': True
            },
            {
                'drillName': 'Crossing and Finishing',
                'drillType': 'Crossing',
                'coachID': 9,
                # Crossing & finishing combination drill — Football Xtra
                'url': 'https://www.youtube.com/watch?v=4sGNd6TRJSk',
                'difficultyLevel': 'Intermediate',
                'instructions': 'Practice crossing from wide areas and finishing.',
                'imageBackgroundColor': '#8A2BE2',
                'imageText': 'Cross',
                'imageTextColor': '#FFFFFF',
                'publicDrill': True
            },
            {
                'drillName': 'High Press Drill',
                'drillType': 'Tactics',
                'coachID': 31,
                # Gegenpressing / high press drill explained — Tifo Football
                'url': 'https://www.youtube.com/watch?v=W8shcQMqoK8',
                'difficultyLevel': 'Advanced',
                'instructions': 'Coordinate pressing to win possession quickly.',
                'imageBackgroundColor': '#228B22',
                'imageText': 'Press',
                'imageTextColor': '#FFFFFF',
                'publicDrill': False
            },
            {
                'drillName': 'Agility Ladder Footwork',
                'drillType': 'Fitness',
                'coachID': 26,
                # Agility ladder soccer footwork drill — Coerver
                'url': 'https://www.youtube.com/watch?v=pLnmhGqH3qo',
                'difficultyLevel': 'Beginner',
                'instructions': 'Improve foot speed using agility ladder drills.',
                'imageBackgroundColor': '#FF69B4',
                'imageText': 'Agility',
                'imageTextColor': '#000000',
                'publicDrill': True
            },
            {
                'drillName': 'Long Ball Accuracy',
                'drillType': 'Passing',
                'coachID': 31,
                # Long passing accuracy drill — Tony Waiters
                'url': 'https://www.youtube.com/watch?v=MFNSKGGy6rI',
                'difficultyLevel': 'Advanced',
                'instructions': 'Practice accurate long-range passing.',
                'imageBackgroundColor': '#FFA500',
                'imageText': 'Long Pass',
                'imageTextColor': '#000000',
                'publicDrill': True
            }
        ]

        for drill in drills:
            coach = User.objects.get(id=drill['coachID'])

            Drill.objects.create(
                drillName=drill['drillName'],
                drillType=drill['drillType'],
                coachID=coach,
                url=drill['url'],
                difficultyLevel=drill['difficultyLevel'],
                instructions=drill['instructions'],
                imageBackgroundColor=drill['imageBackgroundColor'],
                imageText=drill['imageText'],
                imageTextColor=drill['imageTextColor'],
                publicDrill=drill['publicDrill']
            )


        # ── Workouts ──────────────────────────────────────────────────────────
        workouts = [
            {
                'workoutName': 'Beginner Ball Control',
                'workoutType': 'Technical',
                'coachID': 1,
                'imageBackgroundColor': '#1E90FF',
                'imageText': 'Control',
                'imageTextColor': '#FFFFFF',
                'publicWorkout': True,
                'drills': [
                    {'drill_id': 1, 'minutes': 10},
                    {'drill_id': 6, 'minutes': 10},
                ]
            },
            {
                'workoutName': 'Attacking Finishing Session',
                'workoutType': 'Attacking',
                'coachID': 3,
                'imageBackgroundColor': '#FF4500',
                'imageText': 'Attack',
                'imageTextColor': '#FFFFFF',
                'publicWorkout': True,
                'drills': [
                    {'drill_id': 2, 'minutes': 10},
                    {'drill_id': 4, 'repetitions': 15},
                    {'drill_id': 7, 'repetitions': 10},
                ]
            },
            {
                'workoutName': 'Midfield Mastery',
                'workoutType': 'Passing',
                'coachID': 12,
                'imageBackgroundColor': '#FFD700',
                'imageText': 'Pass',
                'imageTextColor': '#000000',
                'publicWorkout': True,
                'drills': [
                    {'drill_id': 3, 'minutes': 15},
                    {'drill_id': 10, 'repetitions': 8},
                ]
            },
            {
                'workoutName': 'Defensive Discipline',
                'workoutType': 'Defending',
                'coachID': 14,
                'imageBackgroundColor': '#2F4F4F',
                'imageText': 'Defend',
                'imageTextColor': '#FFFFFF',
                'publicWorkout': True,
                'drills': [
                    {'drill_id': 5, 'minutes': 15},
                    {'drill_id': 8, 'minutes': 10},
                ]
            },
            {
                'workoutName': 'Speed & Agility',
                'workoutType': 'Fitness',
                'coachID': 26,
                'imageBackgroundColor': '#FF69B4',
                'imageText': 'Agility',
                'imageTextColor': '#000000',
                'publicWorkout': True,
                'drills': [
                    {'drill_id': 9, 'minutes': 15},
                    {'drill_id': 1, 'minutes': 5},
                ]
            },
            {
                'workoutName': 'Elite Attacker Routine',
                'workoutType': 'Advanced',
                'coachID': 31,
                'imageBackgroundColor': '#8B0000',
                'imageText': 'Elite',
                'imageTextColor': '#FFFFFF',
                'publicWorkout': False,
                'drills': [
                    {'drill_id': 2, 'minutes': 10},
                    {'drill_id': 4, 'repetitions': 20},
                    {'drill_id': 7, 'repetitions': 15},
                ]
            },
            {
                'workoutName': 'Wing Play Specialist',
                'workoutType': 'Crossing',
                'coachID': 9,
                'imageBackgroundColor': '#8A2BE2',
                'imageText': 'Wing',
                'imageTextColor': '#FFFFFF',
                'publicWorkout': True,
                'drills': [
                    {'drill_id': 7, 'repetitions': 12},
                    {'drill_id': 2, 'minutes': 8},
                ]
            },
            {
                'workoutName': 'Tactical Pressing Session',
                'workoutType': 'Tactics',
                'coachID': 24,
                'imageBackgroundColor': '#228B22',
                'imageText': 'Press',
                'imageTextColor': '#FFFFFF',
                'publicWorkout': False,
                'drills': [
                    {'drill_id': 8, 'minutes': 20},
                    {'drill_id': 5, 'minutes': 10},
                ]
            }
        ]

        for workoutData in workouts:
            coach = User.objects.get(id=workoutData['coachID'])

            workout = Workout.objects.create(
                workoutName=workoutData['workoutName'],
                workoutType=workoutData['workoutType'],
                coachID=coach,
                imageBackgroundColor=workoutData['imageBackgroundColor'],
                imageText=workoutData['imageText'],
                imageTextColor=workoutData['imageTextColor'],
                publicWorkout=workoutData['publicWorkout']
            )

            for d in workoutData['drills']:
                drill = Drill.objects.get(id=d['drill_id'])

                WorkoutDrill.objects.create(
                    workoutID=workout,
                    drillID=drill,
                    minutes=d.get('minutes'),
                    repetitions=d.get('repetitions')
                )


        # ── Assignments (3 per class, mapped by class_id 1-indexed) ──────────
        # Format: (workout_id, label, class_id)
        # Every class (IDs 1-16) gets at least 3 assignments.
        now = timezone.now()

        assignment_data = [
            # Class 1 – Elite Finishing Academy
            (1, 'Control Session',        1),
            (2, 'Attacking Finishing',    1),
            (4, 'Defensive Shape',        1),
            # Class 2 – Striker Masterclass
            (2, 'Striker Drill Set',      2),
            (6, 'Elite Finishing',        2),
            (7, 'Crossing Practice',      2),
            # Class 3 – Midfield Control & Vision
            (3, 'Midfield Passing',       3),
            (1, 'First Touch Mastery',    3),
            (5, 'Agility Circuit',        3),
            # Class 4 – Defensive Wall Training
            (4, 'Defensive Shape',        4),
            (8, 'Pressing Tactics',       4),
            (5, 'Defensive Agility',      4),
            # Class 5 – Wing Play & Speed
            (7, 'Wing Play Practice',     5),
            (5, 'Speed Work',             5),
            (2, 'Wide Attacking Moves',   5),
            # Class 6 – Playmaker's Lab
            (3, 'Vision & Passing',       6),
            (1, 'Ball Mastery',           6),
            (6, 'Creative Finishing',     6),
            # Class 7 – Attacking Intelligence
            (6, 'Elite Attack Run',       7),
            (2, 'Advanced Finishing',     7),
            (7, 'Combination Play',       7),
            # Class 8 – Women's Elite Training
            (2, 'Clinical Finishing',     8),
            (5, 'Fitness & Agility',      8),
            (1, 'Technical Control',      8),
            # Class 9 – Defensive Leadership
            (4, 'Defensive Mastery',      9),
            (8, 'High Press Defense',     9),
            (5, 'Recovery Runs',          9),
            # Class 10 – Creative Midfielders Hub
            (3, 'Creative Passing',       10),
            (1, 'Touch & Control',        10),
            (5, 'Midfield Fitness',       10),
            # Class 11 – Elite Defensive Systems
            (4, 'System Defense',         11),
            (8, 'Compact Pressing',       11),
            (5, 'Defensive Speed',        11),
            # Class 12 – Transition Play Mastery
            (2, 'Fast Break Finishing',   12),
            (7, 'Counter Attack Wide',    12),
            (5, 'Transition Sprint',      12),
            # Class 13 – Advanced Wing Tactics
            (7, 'Advanced Crossing',      13),
            (2, 'Wing to Goal',           13),
            (5, 'Wing Sprint Drills',     13),
            # Class 14 – Team Chemistry & Passing
            (3, 'Team Passing Flow',      14),
            (1, 'First Touch Together',   14),
            (5, 'Team Fitness',           14),
            # Class 15 – Compact Defense Training
            (4, 'Compact Shape',          15),
            (8, 'Compact Press',          15),
            (5, 'Defensive Conditioning', 15),
            # Class 16 – Elite Tactical Awareness
            (8, 'Tactical Pressing',      16),
            (3, 'Tactical Passing',       16),
            (4, 'Tactical Defense',       16),
        ]

        for i, (workout_id, label, class_id) in enumerate(assignment_data):
            workout = Workout.objects.get(id=workout_id)
            soccer_class = SoccerClass.objects.get(id=class_id)

            assignment = Assignment.objects.create(
                workoutID=workout,
                dueDate=now + timedelta(days=2 * (i + 1)),
                imageBackgroundColor=workout.imageBackgroundColor,
                imageText=label,
                imageTextColor=workout.imageTextColor
            )

            soccer_class.assignments.add(assignment)

        fake_video_urls = [
            'https://www.youtube.com/watch?v=aPdaHHNrSdU',
            'https://www.youtube.com/watch?v=OtMEFtGFpxQ',
            'https://www.youtube.com/watch?v=TuVGYFaWHvQ',
            'https://www.youtube.com/watch?v=jfKfPfyJRdk',
            'https://www.youtube.com/watch?v=1XjNsKSEhIQ',
            'https://www.youtube.com/watch?v=zYBCHkAFJO8',
            'https://www.youtube.com/watch?v=4sGNd6TRJSk',
            'https://www.youtube.com/watch?v=W8shcQMqoK8',
            'https://www.youtube.com/watch?v=pLnmhGqH3qo',
            'https://www.youtube.com/watch?v=MFNSKGGy6rI',
        ]

        now = timezone.now()

        for soccer_class in SoccerClass.objects.all():
            members = ClassMember.objects.filter(classID=soccer_class)
            student_users = [m.studentID for m in members]

            for assignment in soccer_class.assignments.all():
                workout = assignment.workoutID
                workout_drills = WorkoutDrill.objects.filter(workoutID=workout)

                for student in student_users:
                    if random.random() > 0.3:
                        date_submitted = now - timedelta(days=random.randint(1, 10))
                        is_graded = random.random() < 0.7

                        submission = Submission.objects.create(
                            studentID=student,
                            assignmentID=assignment,
                            dateSubmitted=date_submitted,
                            grade=random.randint(60, 100) if is_graded else None,
                            dateGraded=date_submitted + timedelta(days=random.randint(1, 3)) if is_graded else None,
                            imageBackgroundColor=assignment.imageBackgroundColor,
                            imageText=assignment.imageText,
                            imageTextColor=assignment.imageTextColor,
                        )

                        for wd in workout_drills:
                            SubmittedDrill.objects.create(
                                submissionID=submission,
                                drillID=wd.drillID,
                                videoURL=random.choice(fake_video_urls),
                                grade=random.randint(60, 100) if is_graded else None,
                                touchCount=random.randint(5, 50),
                            )

        self.stdout.write(self.style.SUCCESS('Database Populated'))
