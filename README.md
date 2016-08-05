# dotconf-assist

dotconf-assist is a web tool which is used for making configurations for user while using [Splunk Enterprise](http://www.splunk.com/en_us/products/splunk-enterprise.html). It is also used by administrator to check requests sent by users and to make configurations.

## Frameworks

* [Ruby on Rails](http://rubyonrails.org/)
* [Bootstrap](http://getbootstrap.com/)

## Requirements

* Ruby 2.0.0-p353
* Rails 4.1.1
* [Bundler](http://bundler.io/)
* [rbenv](https://github.com/sstephenson/rbenv#installation)
* MySQL > 5.0

## Quick Start

```
$ git clone https://github.com/rakutentech/dotconf-assist
$ cd dotconf-assist
$ vi config/config.yml (please refer to config/config.example.yml)
$ vi config/database.yml (please refer to config/database.example.yml)
$ rbenv global 2.0.0-p353
$ bundle install
$ rbenv rehash
$ rake db:create
$ rake db:migrate
$ rails server
```

Some errors? Please read logs! For datastore, don't forget to install MySQL development package,
`yum install mysql-devel` or `apt-get install mysql-dev`.

## License

The MIT License