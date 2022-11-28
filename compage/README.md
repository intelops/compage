### Redis installation

`docker run -d -p 6379:6379 -v /home/mahendrabagul/DevEnv/compage-dev/redis/data:/data -v /home/mahendrabagul/DevEnv/compage-dev/redis/redis.conf:/usr/local/etc/redis.conf --name redis redis /usr/local/etc/redis.conf --requirepass compage123`
