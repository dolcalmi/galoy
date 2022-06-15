container_id=$(docker ps -q -f status=running -f name="bitcoind")
# walletname="specter/multisig"
walletname="specter/coldstorage"
docker exec $container_id bitcoin-cli listwallets
docker exec $container_id bitcoin-cli --rpcwallet=$walletname getwalletinfo
docker exec $container_id bitcoin-cli --rpcwallet=$walletname listdescriptors
docker exec $container_id bitcoin-cli --rpcwallet=$walletname listtransactions
docker exec $container_id bitcoin-cli gettransaction "454adc4450262145f40ac67bc09332cee8760276b2dd6401c592c6f33d907d25"
docker exec $container_id bitcoin-cli getaddressinfo "bcrt1qyqut7ht3fkcnej565kynh25wa03dz74jvhkfyy"
docker exec $container_id bitcoin-cli getaddressinfo "bcrt1q4n50nngv4vyxy435daagz0a0j5tlnutnmhkpqtcdngpvgyt4xs8qqq2syf"
# docker exec $container_id bitcoin-cli gettransaction "f2f6d9e2e9ab8330d2da58a14265bc743306ecc9d78b9db868cce4fda00ea878"
# docker exec $container_id bitcoin-cli getaddressinfo "bcrt1q25gnxxpkz6sjs7w7qn3rjytwptgjmwgk9m7vc3"
# docker exec $container_id bitcoin-cli getaddressinfo "bcrt1qvxr67c8cdxddgqeume0ran7qdwce7c3lpk62cph6cjevvfzsyclqu97vk5"
# docker exec $container_id bitcoin-cli --rpcwallet=$walletname getnewaddress

# docker exec $container_id bitcoin-cli listwallets
# docker exec $container_id bitcoin-cli createwallet $walletname true
# docker exec $container_id bitcoin-cli --rpcwallet=$walletname getwalletinfo
# docker exec $container_id bitcoin-cli --rpcwallet=$walletname getbalance
# docker exec $container_id bitcoin-cli --rpcwallet=$walletname getnewaddress
# docker exec $container_id bitcoin-cli --rpcwallet=$walletname iportdescriptors '[{"desc": "wsh(sortedmulti(1,[f8f35e11/1h]tpubDA6FueDmbBpDumr4GXmKyy8kJYRTrf5RRXfAqr6d5AweKDxrFgu8ndhEQqTPsyPG3pfMBTRyE5GwcPrKh6njNG3Rx37ydFQNKEvPZwpVqcH/0/*,[b99a0fa2/1h]tpubD9dFYWdkmt1xFL5DgY9nHfCrWaTTsRBhZBwSX563T1x8DL1Jokr6eoQRjvDxpgFKjCTTinKD4nWb84AiyTAjRVwT8chgb7ZBjB1YinWUhnH/0/*))#9eryzl4n", "internal": false, "range": [0, 1000], "timestamp": "now", "watchonly": true, "keypool": true}]'
# docker exec $container_id bitcoin-cli --rpcwallet=$walletname getwalletinfo
# docker exec $container_id bitcoin-cli --rpcwallet=$walletname getbalance
# docker exec $container_id bitcoin-cli --rpcwallet=$walletname importmulti
# docker exec $container_id bitcoin-cli --rpcwallet=$walletname getnewaddress
