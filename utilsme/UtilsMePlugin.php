<?php namespace Craft;

/**
 * Utilites Me! Craft CMS plugin
 * Uncover the glory of the hidden Utilities CP section
 *
 * @author      Mats Mikkel Rummelhoff <http://mmikkel.no>
 * @package     Utilities Me!
 * @since       Craft 2.3
 * @copyright   Copyright (c) 2015, Mats Mikkel Rummelhoff
 * @license     http://opensource.org/licenses/mit-license.php MIT License
 * @link        https://github.com/mmikkel/UtilsMe-Craft
 */

class UtilsMePlugin extends BasePlugin
{

    protected   $_version = '1.0',
                $_developer = 'Mats Mikkel Rummelhoff',
                $_developerUrl = 'http://mmikkel.no',
                $_pluginUrl = 'https://github.com/mmikkel/UtilsMe-Craft';

    public function getName()
    {
         return Craft::t( 'Utilities Me!' );
    }

    public function getVersion()
    {
        return $this->_version;
    }

    public function getDeveloper()
    {
        return $this->_developer;
    }

    public function getDeveloperUrl()
    {
        return $this->_developerUrl;
    }

    public function getPluginUrl()
    {
        return $this->_pluginUrl;
    }

    public function hasCpSection()
    {
        return true;
    }

    protected function defineSettings()
    {
        return array(
            'hideNavTab' => array( AttributeType::Bool, 'default' => false ),
        );
    }

    public function getSettingsHtml()
    {
        return craft()->templates->render( 'utilsme/settings', array(
            'settings' => $this->getSettings(),
        ) );
    }

    public function registerCpRoutes()
    {
        return array(
            'utilsme(/(?P<section>[-\w]+))?' => array( 'action' => 'utilsMe/redirect' ),
        );
    }

    public function init () {

        parent::init();

        if ( craft()->request->isCpRequest() ) {

            $settings = $this->getSettings();

            craft()->templates->includeCssResource( 'utilsme/css/utilsMe.css' );
            craft()->templates->includeJs( 'var _utilsmeConfig = { baseUrl : "' . rtrim( UrlHelper::getUrl( 'utilsme' ), '/' ) . '/", hideNavTab : ' . ( isset( $settings[ 'hideNavTab' ] ) && $settings[ 'hideNavTab' ] ? 1 : 0 ) .  ' };' );
            craft()->templates->includeJsResource( 'utilsme/js/utilsMe.js' );

        }

    }

}
