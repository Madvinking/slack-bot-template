export const userTable = `create table if not exists user (
id char(9) NOT NULL,
team_id char(9) NOT NULL,
name varchar(36) NOT NULL,
real_name varchar(36) NOT NULL,
access_token varchar(51) NOT NULL,
scopes varchar(500) NOT NULL,
PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

export const teamTable = `create table if not exists team (
id char(9) NOT NULL,
team_name varchar(100) NOT NULL,
access_token varchar(100) NOT NULL,
scope varchar(100) NOT NULL,
PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;`;

export const channelTable = `create table if not exists channel (
id char(9) NOT NULL,
name varchar(100) NOT NULL,
creator char(9) NOT NULL,
team_id char(9) NOT NULL,
PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
