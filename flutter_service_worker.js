'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "737df28e95562fed6126fc69dab94a9f",
"version.json": "687a84ac313b64edf3a2e20bb1d5bfad",
"index.html": "1d8b4772a85428fbd874759dd6777f8f",
"/": "1d8b4772a85428fbd874759dd6777f8f",
"main.dart.js": "5dc3e6f7451047b23de2ab4e77264ad0",
"flutter.js": "24bc71911b75b5f8135c949e27a2984e",
"favicon.png": "89faf63cb1833a17313ac730d153920c",
"logo.png": "3f51155b6e4faadcf3e800de0289c59b",
"icons/Icon-192.png": "38c7658e251104bd94c9e391a24cf460",
"icons/Icon-maskable-192.png": "38c7658e251104bd94c9e391a24cf460",
"icons/Icon-maskable-512.png": "8a15a17512aa5bfcb2e6d472d3382e1c",
"icons/Icon-512.png": "8a15a17512aa5bfcb2e6d472d3382e1c",
"manifest.json": "78114388b8913877756e702f19de97af",
".git/config": "7926594b814aaf8ec8180777aca416e7",
".git/objects/92/7192d2ab27da471bcd0787bde4af4dbc654100": "de8d6e486e27cc9077a4885537e201d8",
".git/objects/68/43fddc6aef172d5576ecce56160b1c73bc0f85": "2a91c358adf65703ab820ee54e7aff37",
".git/objects/6f/f02abf7d99a9f7145ece672e294304ca9b2f94": "632f04674357903a5c1710aa0123ccc8",
".git/objects/6f/7661bc79baa113f478e9a717e0c4959a3f3d27": "985be3a6935e9d31febd5205a9e04c4e",
".git/objects/6a/12ff5a7bc8ca72c403e523107e41cea2ef54c7": "f2901a988b8e4e26b8dce3749b6e6e2f",
".git/objects/69/b2023ef3b84225f16fdd15ba36b2b5fc3cee43": "6ccef18e05a49674444167a08de6e407",
".git/objects/51/03e757c71f2abfd2269054a790f775ec61ffa4": "d437b77e41df8fcc0c0e99f143adc093",
".git/objects/93/b363f37b4951e6c5b9e1932ed169c9928b1e90": "c8d74fb3083c0dc39be8cff78a1d4dd5",
".git/objects/0e/d698bca1e8ecf603a4a76f88bdd8f5b7aaeee1": "51dcbf4c92ba59444a3a1c7c0effa656",
".git/objects/a4/aac40b20891cbf523e434af144216ba8d80969": "ed4ff379311f3ca8ee4043dcb910b5c8",
".git/objects/d9/5b1d3499b3b3d3989fa2a461151ba2abd92a07": "a072a09ac2efe43c8d49b7356317e52e",
".git/objects/ad/ced61befd6b9d30829511317b07b72e66918a1": "37e7fcca73f0b6930673b256fac467ae",
".git/objects/bb/eaddc4462ae4bdeccd0fc5d69e7eea72288a5d": "1efa8ff93293ce533ac49110a479a6d0",
".git/objects/d7/35fc264b9243131249cbca55998e54a28a7282": "92f21ee92fb7dc16a32e3b63c0311784",
".git/objects/d7/7cfefdbe249b8bf90ce8244ed8fc1732fe8f73": "9c0876641083076714600718b0dab097",
".git/objects/da/6c4cef66b0fc2bf13df3be4536fdfd5490a076": "3061091734d0e099c91ea475d6850913",
".git/objects/bc/cea5e1d7007eabc397a0f057dbbf0c1bf755ed": "0e03fc576be5c3a9cb36ef59512598cf",
".git/objects/f3/3e0726c3581f96c51f862cf61120af36599a32": "afcaefd94c5f13d3da610e0defa27e50",
".git/objects/fd/05cfbc927a4fedcbe4d6d4b62e2c1ed8918f26": "5675c69555d005a1a244cc8ba90a402c",
".git/objects/f5/72b90ef57ee79b82dd846c6871359a7cb10404": "e68f5265f0bb82d792ff536dcb99d803",
".git/objects/c8/3af99da428c63c1f82efdcd11c8d5297bddb04": "144ef6d9a8ff9a753d6e3b9573d5242f",
".git/objects/fb/a8ec462fb93e675fb84f2580b8eb7b6d3a5ba5": "b5456cdd03c880664cba02e8c76324a4",
".git/objects/7c/3463b788d022128d17b29072564326f1fd8819": "37fee507a59e935fc85169a822943ba2",
".git/objects/45/a7c9297a92322eba1ed6f2cbea078152bc067e": "d3ecdca2f628760645ffa2d7142ad2e1",
".git/objects/87/49f43a2aac2e8da7f349e0f9a8c16290a344da": "bd48877d2c1ce0d86df7062717af6cf1",
".git/objects/8f/24d255d2c0f2ee311c3c7cab89c43b62f65a57": "23fc65cdae80b41b5db1a0d9a624b0df",
".git/objects/6b/9862a1351012dc0f337c9ee5067ed3dbfbb439": "85896cd5fba127825eb58df13dfac82b",
".git/objects/38/0d7a153142d271415ee1d5859a2444709a7faf": "01002488a9a9b20c51277595462f8c91",
".git/objects/6e/cd57f1cabb86fa801c693d0446c3d8f41f5b37": "4d13a4b2e6c9c4627ca342eb135e4807",
".git/objects/9a/d94668a9bba7d3a5433d126f8655064120af5c": "7ea5275ad77ae20bd0bf26ed349ae537",
".git/objects/3a/8cda5335b4b2a108123194b84df133bac91b23": "1636ee51263ed072c69e4e3b8d14f339",
".git/objects/3a/6d9e77bf1afbee8c21441cb856e9c9bc2cfa5e": "09c098738587f27fdf96c712fd72c081",
".git/objects/08/27c17254fd3959af211aaf91a82d3b9a804c2f": "360dc8df65dabbf4e7f858711c46cc09",
".git/objects/55/d1548e34f9a36553429e0f91f2a608671582f8": "b2acaa17436ffe8c7c203b28ebc1d482",
".git/objects/55/84121f09b16719e033835642955f79cb4795a1": "0289864ccdad97f5f139dd05a039c8f8",
".git/objects/bf/e2d3266016d21603ace5437aa519596469df29": "1643e3c485b2c10f0e63735c37aa8339",
".git/objects/d4/3532a2348cc9c26053ddb5802f0e5d4b8abc05": "3dad9b209346b1723bb2cc68e7e42a44",
".git/objects/dd/21d5bb5a8865c8b1e31bd6413a5d9daabaf44d": "46b1b7e854a372c07ca4e4667147fbb7",
".git/objects/b0/637d74f6bcafafa082dfdd4c0da4cc54e2c89f": "6a130988a3050a684d1837b87cc6a348",
".git/objects/b9/8d20cb60758b28d372c27215ea460fa0680b44": "b853e8dd8339710b13f7f3adb19818ec",
".git/objects/b9/3e39bd49dfaf9e225bb598cd9644f833badd9a": "666b0d595ebbcc37f0c7b61220c18864",
".git/objects/a1/2cb1bded8acc150f47315dbd116a602af62760": "def6a2a0eaa4e92316aa30ea093dad5c",
".git/objects/e6/eb8f689cbc9febb5a913856382d297dae0d383": "466fce65fb82283da16cdd7c93059ff3",
".git/objects/f6/e6c75d6f1151eeb165a90f04b4d99effa41e83": "95ea83d65d44e4c524c6d51286406ac8",
".git/objects/e9/94225c71c957162e2dcc06abe8295e482f93a2": "2eed33506ed70a5848a0b06f5b754f2c",
".git/objects/e7/af9dce14ae2eb53d0b698b074c4259c1066b59": "3ba356864c3d2e780a65254890467652",
".git/objects/46/4ab5882a2234c39b1a4dbad5feba0954478155": "2e52a767dc04391de7b4d0beb32e7fc4",
".git/objects/24/546e3ff63beeb193e420298b33ba6873ec18d0": "088557afbbbbbc93ef2a5f1b6e30ff48",
".git/objects/4f/d8a0d4b0772039f2af2acd0eca05c4550977a9": "855c25064a5758944a3314e40e5c750d",
".git/objects/8c/d89dd80b57faadba4ae73d43d2254e644f9d6c": "f676753b58bef27c6f1e3d704c308055",
".git/objects/85/63aed2175379d2e75ec05ec0373a302730b6ad": "997f96db42b2dde7c208b10d023a5a8e",
".git/objects/13/0c366bce0dc57e994d1ef818171a7b263699db": "6dc4b4d9e72a48b2808f8e7c364ef42d",
".git/HEAD": "cf7dd3ce51958c5f13fece957cc417fb",
".git/info/exclude": "036208b4a1ab4a235d75c181e685e5a3",
".git/logs/HEAD": "01db49d8f4e430bc7c5d8fee8868f6d1",
".git/logs/refs/heads/main": "01db49d8f4e430bc7c5d8fee8868f6d1",
".git/logs/refs/remotes/origin/main": "ada2d5b4c39ed091ac44c34f1a02c6c5",
".git/description": "a0a7c3fff21f2aea3cfa1d0316dd816c",
".git/hooks/commit-msg.sample": "579a3c1e12a1e74a98169175fb913012",
".git/hooks/pre-rebase.sample": "56e45f2bcbc8226d2b4200f7c46371bf",
".git/hooks/sendemail-validate.sample": "4d67df3a8d5c98cb8565c07e42be0b04",
".git/hooks/pre-commit.sample": "5029bfab85b1c39281aa9697379ea444",
".git/hooks/applypatch-msg.sample": "ce562e08d8098926a3862fc6e7905199",
".git/hooks/fsmonitor-watchman.sample": "a0b2633a2c8e97501610bd3f73da66fc",
".git/hooks/pre-receive.sample": "2ad18ec82c20af7b5926ed9cea6aeedd",
".git/hooks/prepare-commit-msg.sample": "2b5c047bdb474555e1787db32b2d2fc5",
".git/hooks/post-update.sample": "2b7ea5cee3c49ff53d41e00785eb974c",
".git/hooks/pre-merge-commit.sample": "39cb268e2a85d436b9eb6f47614c3cbc",
".git/hooks/pre-applypatch.sample": "054f9ffb8bfe04a599751cc757226dda",
".git/hooks/pre-push.sample": "2c642152299a94e05ea26eae11993b13",
".git/hooks/update.sample": "647ae13c682f7827c22f5fc08a03674e",
".git/hooks/push-to-checkout.sample": "c7ab00c7784efeadad3ae9b228d4b4db",
".git/refs/heads/main": "8cedef4dfde8dcd046cc3aaaf9d5bea4",
".git/refs/remotes/origin/main": "8cedef4dfde8dcd046cc3aaaf9d5bea4",
".git/index": "8f80bceb1423e5505c4888d1516f28d0",
".git/COMMIT_EDITMSG": "145316ccac12ae1a5293d2b53caabacb",
"assets/NOTICES": "7c2a2eeb3edd362b6785ad499c8546a5",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.bin.json": "2c19d2b8dda3c81981ce6ab9bdbefdc4",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/shaders/stretch_effect.frag": "40d68efbbf360632f614c731219e95f0",
"assets/AssetManifest.bin": "9eb1fdf6ebfb0bb8f1a1abd23f9b50b4",
"assets/fonts/MaterialIcons-Regular.otf": "4f7349819a204a8ec901dde2426ecbe5",
"assets/assets/img_logo_converted.png": "bc77c20caa2d707e50208e6f05228f73",
"assets/assets/data/decks/pack6-lieu-mang.json": "c82fadbf5bc00cdda6e4d26ad6ecb0f6",
"assets/assets/data/decks/pack8-kinh-di.json": "7eba19da6c4957b003a54bcb2b893167",
"assets/assets/data/decks/pack9-tam-su-dem-khuya.json": "7425f5b53a80a4d2d1b00970d19d92e4",
"assets/assets/data/decks/_template.json": "437dbea216b64e8567f576c36ff39c1b",
"assets/assets/data/decks/pack1-ice-breaker.json": "ba14653500e0e2a1ce549c37eb81393d",
"assets/assets/data/decks/pack7-nong-bong-18plus.json": "18777e04f410634e0142b7bcb80c42b5",
"assets/assets/data/decks/pack3-high-intensive.json": "57639b717e28f4a32a330981c81135fe",
"assets/assets/data/decks/pack5-uong-di-cho-chi.json": "1d9afaafb535893884973863e821c14f",
"assets/assets/data/decks/pack2-deep-talk.json": "a07b2727e793aabd8ae599c4f7583703",
"assets/assets/data/decks/pack4-mini-game.json": "79c8e12860dad6bb38a856548aee50bd",
"assets/assets/img_logo.png": "3f51155b6e4faadcf3e800de0289c59b",
"canvaskit/skwasm.js": "8060d46e9a4901ca9991edd3a26be4f0",
"canvaskit/skwasm_heavy.js": "740d43a6b8240ef9e23eed8c48840da4",
"canvaskit/skwasm.js.symbols": "3a4aadf4e8141f284bd524976b1d6bdc",
"canvaskit/canvaskit.js.symbols": "a3c9f77715b642d0437d9c275caba91e",
"canvaskit/skwasm_heavy.js.symbols": "0755b4fb399918388d71b59ad390b055",
"canvaskit/skwasm.wasm": "7e5f3afdd3b0747a1fd4517cea239898",
"canvaskit/chromium/canvaskit.js.symbols": "e2d09f0e434bc118bf67dae526737d07",
"canvaskit/chromium/canvaskit.js": "a80c765aaa8af8645c9fb1aae53f9abf",
"canvaskit/chromium/canvaskit.wasm": "a726e3f75a84fcdf495a15817c63a35d",
"canvaskit/canvaskit.js": "8331fe38e66b3a898c4f37648aaf7ee2",
"canvaskit/canvaskit.wasm": "9b6a7830bf26959b200594729d73538e",
"canvaskit/skwasm_heavy.wasm": "b0be7910760d205ea4e011458df6ee01"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
