requirejs.config({
	baseUrl: '/js',
    paths: {
      underscore: rwFB.CDN + '/js/underscore.min', 
      backbone: rwFB.CDN + '/js/backbone.min',
      text: rwFB.CDN + '/js/text.min',
      babysitter: rwFB.CDN + '/js/babysitter.min',
      csvparser : '/js/jquery.csv-0.71.min',
      rwcore : '/js/rwcore.min',
      ReferralWireBase : '/js/ReferralWireBase.min',
      ReferralWireRouterBase : '/js/ReferralWireRouterBase.min',
      RWAuth : '/js/RWAuth.min',
      templatecache: '/js/templatecache.min',
      ReferralWireView : '/js/ReferralWireView.min',
      ReferralWirePattern : '/js/ReferralWirePattern.min',
      ReferralWireRouter : '/js/ReferralWireRouter.min',
      ReferralWirePhoneRouter : '/js/ReferralWirePhoneRouter.min',
      ReferralWire : '/js/ReferralWire',
      STN : '/js/STN',
    },
    waitSeconds: 30,
    shim: { 
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore'],
            exports: 'Backbone'
        },
        'rwcore' : {
            deps: ['backbone'],
            exports: 'rwcore'
        },
        'RWAuth' : {
            deps: ['rwcore'],
            exports: 'RWAuth'
        },
        'templatecache' : {
            deps: ['underscore'],
            exports: 'templatecache'
        },
        'babysitter' : {
            exports: 'babysitter'
        },
        'ReferralWireBase' : {
            deps: ['backbone', 'templatecache', 'babysitter'],
            exports: 'ReferralWireBase'
        },
        'ReferralWireView' : {
            deps: ['ReferralWireBase'],
            exports: 'ReferralWireView'
         },
        'ReferralWirePattern' : {
            deps: ['ReferralWireView'],
            exports: 'ReferralWirePattern'
         },
        'ReferralWireRouterBase' : {
            deps: ['ReferralWirePattern'],
            exports: 'ReferralWireRouter'
         },
        'ReferralWireRouter' : {
            deps: ['ReferralWireRouterBase'],
            exports: 'ReferralWireRouter'
         },
        'ReferralWirePhoneRouter' : {
            deps: ['ReferralWireRouterBase'],
            exports: 'ReferralWirePhoneRouter'
         },
        'ReferralWire' : {
            deps: ['ReferralWireRouter'],
            exports: 'ReferralWire'
         },
        'STN' : {
            deps: ['ReferralWire'],
            exports: 'ReferralWireSTN'
         }
   }
});
