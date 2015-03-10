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

class UtilsMeController extends BaseController
{

	public function actionRedirect( array $variables = array() )
	{
		$utilsUrl = UrlHelper::getUrl( 'utils' . ( isset( $variables[ 'section' ] ) ? '/' . $variables[ 'section' ] : '' ) );
		craft()->request->redirect( $utilsUrl );
	}

}
