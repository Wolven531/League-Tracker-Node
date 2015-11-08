#!/usr/bin/python

import sys, getopt, mysql.connector

def main(argv):
  user = ''
  password = ''
  host = ''
  database = ''
  usage = '\nUsage: get_games.py -u <user> -p <password> -h <host> -d <database>\n'

  try:
    opts, args = getopt.getopt(argv,'u:p:h:d:',['user=','password=','host=','database=','help'])
  except getopt.GetoptError:
    print usage
    sys.exit(2)

  for opt, arg in opts:
    if opt in ('--help'):
      print usage
      sys.exit()
    elif opt in ('-u', '--user'):
      user = arg
    elif opt in ('-p', '--password'):
      password = arg
    elif opt in ('-h', '--host'):
      host = arg
    elif opt in ('-d', '--database'):
      database = arg

  if user == '' or password == '' or host == '' or database == '':
    print usage
    sys.exit()

  cnx1 = mysql.connector.connect(
    user=user,
    password=password,
    host=host,
    database=database)
  cnx2 = mysql.connector.connect(
    user='root',
    password='',
    host='127.0.0.1',
    database='league_tracker')
  cursor1 = cnx1.cursor()
  cursor2 = cnx2.cursor()

  add_game = ('INSERT INTO games '
    '(id, gameId, championId, createDate, gameMode, gameType, invalid, level, mapId, spell1, spell2, subType, teamId, summonerId, ipEarned, statRef, fellowPlayerRef) '
    'VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)')

# Specify order manually for the insertion statement later
  get_games_query = ('SELECT id, gameId, championId, createDate, gameMode, gameType, invalid, level, mapId, spell1, spell2, subType, teamId, summonerId, ipEarned, statRef, fellowPlayerRef FROM api_league_games')
  cursor1.execute(get_games_query)

  for (row) in cursor1:
    cursor2.execute(add_game, row)

# Make sure data is committed to the database
  cnx2.commit()

  cursor1.close()
  cursor2.close()

  cnx1.close()
  cnx2.close()

if __name__ == '__main__':
   main(sys.argv[1:])