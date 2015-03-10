( function( window ) {

    var utils = {
            'serverinfo' : 'Server Info',
            'phpinfo' : 'PHP Info',
            'logs' : 'Logs',
            'deprecationerrors' : 'Deprecation Errors'
        },
        opts = {
            menuName : 'Utilities',
            navTabSelector : '#nav-utilsme',
            headerSelector : '#header',
            settingsPageUriTrigger : 'settings',
            settingsPageSelector : '#content',
            settingsPageMenuSelector : '#content ul:first',
            settingsMenuSelector : '#settingsmenu',
            settingsSubMenuSelector : '#settingsmenu ul:first',
            settingsMenuTriggerSelector : '#header-actions .settingsmenu.menubtn',
            menuItemIcon : 'settings'
        };

    var UtilsMe = {
        $settingsPage : null,
        $navTabDropdown : null,
        menuItems : null
    };

    UtilsMe.init = function () {

        var self = this;

        self.config = window._utilsmeConfig || false;

        if ( ! self.config ) {
            // Poll for the config
            var configPollerTimeout = 1000,
                configPollerInterval = 100,
                configPollerCount = 0,
                configPoller = setInterval( function () {
                    self.config = window._utilsmeConfig || false;
                    if ( self.config !== false || configPollerCount * configPollerInterval > configPollerTimeout ) {
                        clearInterval( configPoller );
                        self.create();
                    }
                    configPollerCount++;
                }, configPollerInterval );
        } else {
            this.create();
        }

        return this;

    };

    UtilsMe.create = function () {

        if ( ! this.config ) {
            // No config, no service
            return false;
        }

        var self = this;

        this.resizeHandler = $.proxy( onResize, this );

        // Configure nav tab
        if ( ! this.config.hideNavTab ) {
            this.$tab = $( opts.navTabSelector );
            if ( this.$tab.length > 0 ) {
                this.$tab
                    .on( 'mouseenter', $.proxy( onNavTabMouseEnter, this ) )
                    .on( 'mouseleave', $.proxy( onNavTabMouseLeave, this ) )
                    .addClass( 'js-init' )
                    .find( 'a:first' ).text( opts.menuName );
            }
        }

        // Add Utils to settings menu
        $( opts.settingsMenuTriggerSelector ).on( 'click', function ( e ) {
            $.proxy( addToSettingsMenu, self )();
        } );

        // Add to main settings page
        var currentUrl = window.location.href,
            currentUrlSegments = currentUrl.split( '/' ),
            lastSegment = currentUrlSegments.pop();

        if ( lastSegment === opts.settingsPageUriTrigger ) {
            $.proxy( addToSettingsPage, self )();
        }

        $( window ).on( 'resize', this.resizeHandler );

    }

    UtilsMe.getUtilsMenuItems = function () {

        if ( this.menuItems === null ) {

            var menuItems = '';

            for ( var handle in utils ) {
                menuItems += '<li><a href="' + this.config.baseUrl + handle + '" data-icon="' + opts.menuItemIcon + '">' + utils[ handle ] + '</a></li>';
            }

            this.menuItems = menuItems.length > 0 ? menuItems : false;

        }

        return this.menuItems;

    }

    UtilsMe.getNavTabDropdown = function () {

        var utilsMenuItems = this.getUtilsMenuItems();

        if ( ! utilsMenuItems ) {
            return false;
        }

        var $dropDown = $( '<div id="utilsTab-dropdown"><ul class="menu">' + utilsMenuItems + '</ul></div>' );

        $dropDown.find( 'a' ).attr( 'data-icon', '' );

        $dropDown
            .on( 'mouseenter', $.proxy( onNavTabMouseEnter, this ) )
            .on( 'mouseleave', $.proxy( onNavTabMouseLeave, this ) )
            .hide()
            .appendTo( $( 'body' ) );

        return $dropDown;

    }

    function addToSettingsMenu ( e ) {

        var $settingsMenu = $( opts.settingsMenuSelector );

        if ( $settingsMenu.length === 0 || $settingsMenu.find( 'ul.utilsMeMenu' ).length > 0 ) {
            return false;
        }

        var $subMenu = $( opts.settingsSubMenuSelector );

        if ( $subMenu.length === 0 ) {
            return false;
        }

        var $utilsMenu = $subMenu.clone( true ),
            utilsMenuItems = this.getUtilsMenuItems();

        if ( utilsMenuItems ) {

            $utilsMenu.html( utilsMenuItems ).addClass( 'utilsMeMenu' );
            $subMenu.parent().append( '<h6>' + opts.menuName + '</h6>' ).append( $utilsMenu );

        }

    }

    function addToSettingsPage () {

        if ( this.$settingsPage === null ) {

            this.$settingsPage = false;

            var $settingsPage = $( opts.settingsPageSelector ),
                $settingsPageMenu = $( opts.settingsPageMenuSelector );

            if ( $settingsPage.length === 0 || $settingsPageMenu.length === 0 ) {
                return false;
            }

            var $utilsMenu = $settingsPageMenu.clone( true ),
                utilsMenuItems = this.getUtilsMenuItems();

            if ( utilsMenuItems ) {

                $utilsMenu.html( utilsMenuItems );
                $settingsPageMenu.parent().append( '<hr/><h2>' + opts.menuName + '</h2>' ).append( $utilsMenu );

                this.$settingsPage = $settingsPage;

            }

        }

    }

    function onNavTabMouseEnter ( e ) {

        if ( this.mouseLeaveInterval ) {
            clearInterval( this.mouseLeaveInterval );
            delete this.mouseLeaveInterval;
        }

        if ( this.$navTabDropdown === null ) {
            this.$navTabDropdown = this.getNavTabDropdown();
        }

        if ( this.$navTabDropdown ) {
            this.resizeHandler();
            this.$navTabDropdown.fadeIn( 250 );
        }

    }

    function onNavTabMouseLeave ( e ) {

        if ( ! this.$navTabDropdown ) {
            return false;
        }

        if ( this.mouseLeaveInterval ) {
            clearInterval( this.mouseLeaveInterval );
        }

        var self = this;

        this.mouseLeaveInterval = setInterval( function () {
            clearInterval( self.mouseLeaveInterval );
            delete self.mouseLeaveInterval;
            self.$navTabDropdown.fadeOut( 150 );
        }, 100 );

    }

    function onResize ( e ) {

        if ( this.$navTabDropdown ) {

            var tabOffset = this.$tab.offset();

            this.$navTabDropdown.css( {
                left : tabOffset.left,
                top : $( opts.headerSelector ).outerHeight()
            } );
        }

    }

    $( document ).ready( $.proxy( UtilsMe.init, UtilsMe ) );

} ( window ) );