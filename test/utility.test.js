QUnit.module('utility');

test('Provided string should be capitalized', function() {
	equal('Gamesaw', GSGL.utility.capitalize('gamesaw'), 'Is capitalized?');
	notEqual('gamesaw', GSGL.utility.capitalize('gamesaw'), 'Should not be equal');
});
